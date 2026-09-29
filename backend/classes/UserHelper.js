const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcrypt");

class UserHelper {
  async createUser(data) {
    let password = await this.#encryptPassword(data.us_password);
    return new Promise((resolve, reject) => {
      const query = `
            INSERT INTO users(us_syskey, us_username, us_password, admin)
            VALUES(?, ?, ?, ?);
            `;
      const params = [uuid(), data.us_username, password, !!data.admin];
      db.run(query, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    });
  }

  async getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = `
            SELECT id, us_syskey, us_username, admin FROM users
            `;
      db.all(query, [], function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  async deleteUser(syskey) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM users WHERE us_syskey = ?`;
      db.run(query, [syskey], function (err) {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  async toggleAdmin(syskey, admin) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET admin = ? WHERE us_syskey = ?`;
      db.run(query, [!!admin, syskey], function (err) {
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
}

module.exports = UserHelper;
