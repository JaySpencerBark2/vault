const sqlite3 = require("sqlite3").verbose();

class Database {
  constructor(dbFilePath) {
    this.dbFilePath = dbFilePath;
    this.db = null;
  }

  connect() {
    this.db = new sqlite3.Database(this.dbFilePath, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Connected to the SQLite database.");
      }
    });
  }

  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Closed the database connection.");
        }
      });
    }
  }

  runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  allQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Database;
