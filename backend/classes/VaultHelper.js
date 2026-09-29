require('dotenv').config();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

class VaultHelper {
  async createVaultInstance(data) {
    let password = await this.#encryptPassword(data.vh_vaultPassword);
    return new Promise((resolve, reject) => {
      const query = `
            INSERT INTO VA_VaultHeader(vh_vaultheadSyskey, vh_vaultName, vh_vaultPassword, vh_userSyskey, vh_createdAt, vh_updatedAt)
            VALUES(?, ?, ?, ?, ?, ?);
            `;
      const params = [
        uuid(),
        data.vh_vaultName,
        password,
        data.vh_userSyskey,
        new Date(),
        new Date(),
      ];
      db.run(query, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  }

  async getAllVaultInstances(syskey) {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT * FROM VA_VaultHeader WHERE vh_userSyskey = ?
            `;

      let params = [syskey];
      db.all(query, params, function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  async unlockVault(data) {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT * FROM VA_VaultHeader WHERE vh_vaultheadSyskey = ?
        `;

      let params = [data.vh_vaultheadSyskey];
      db.get(query, params, async (err, row) => {
        if (err) {
          return reject(err);
        }
        if (!row) {
          return resolve(false);
        }
        const isPasswordValid = await this.#verifyPassword(
          data.vh_vaultPassword,
          row.vh_vaultPassword
        );
        resolve(isPasswordValid);
      });
    });
  }

  async getVaultLines(headerSyskey) {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT * FROM VA_VaultLines WHERE vh_vaultheaderSyskey = ?
            `;

      let params = [headerSyskey];
      db.all(query, params, async (err, rows) => {
        if (err) {
          return reject(err);
        }
        
        // Decrypt the line content for each row
        const decryptedRows = rows.map(row => ({
          ...row,
          vh_lineContent: this.#decryptContent(row.vh_lineContent)
        }));
        
        resolve(decryptedRows);
      });
    });
  }

  async CreateVaultRecord(data) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO VA_VaultLines(vh_vaultheaderSyskey,vh_lineSyskey, vh_lineName, vh_lineContent, vh_createdAt, vh_updatedAt)
            VALUES(?, ?, ?, ?, ?, ?);`;
      
      // Encrypt the line content before storing
      const encryptedContent = this.#encryptContent(data.vl_lineContent);
      
      const params = [data.headerSyskey, uuid(), data.vl_lineName, encryptedContent, new Date(), new Date()];
      db.run(query, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  async updateVaultRecord(syskey, data) {
    return new Promise((resolve, reject) => {
      const query = `
            UPDATE VA_VaultLines SET
              vh_lineContent = ?,
              vh_updatedAt = ?
            WHERE vh_lineSyskey = ?;
            `;
      const rawContent = data.vl_lineContent || data.vh_lineContent || "";
      const encryptedContent = this.#encryptContent(rawContent);
      const params = [encryptedContent, new Date(), syskey];
      db.run(query, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  async #encryptPassword(password) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async #verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  #encryptContent(content) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-secret-key-must-be-32-chars', 'salt', 32);
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Combine IV and encrypted content
    return iv.toString('hex') + ':' + encrypted;
  }

  #decryptContent(encryptedContent) {
    try {
      const algorithm = 'aes-256-cbc';
      const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-secret-key-must-be-32-chars', 'salt', 32);
      
      // Split IV and encrypted content
      const parts = encryptedContent.split(':');
      if (parts.length !== 2) {
        throw new Error('Invalid encrypted content format');
      }
      
      const iv = Buffer.from(parts[0], 'hex');
      const encrypted = parts[1];
      
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedContent; // Return original if decryption fails
    }
  }
}

module.exports = VaultHelper;
