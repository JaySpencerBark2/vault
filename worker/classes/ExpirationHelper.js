const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "..", "..", "backend", "database.sqlite"));

class ExpirationHelper {
  async sweepExpiredLines() {
    return new Promise((resolve, reject) => {
      const query = `
            UPDATE VA_VaultLines
            SET vl_expired = 1
            WHERE vl_expired = 0
              AND vl_expiresAt IS NOT NULL
              AND date(vl_expiresAt) <= date('now')
            `;
      db.run(query, [], function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.changes);
      });
    });
  }
}

module.exports = ExpirationHelper;
