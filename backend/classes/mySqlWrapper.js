const sqlite3 = require('sqlite3').verbose();

class MySqlWrapper {
    constructor(databaseFile) {
        this.db = new sqlite3.Database(databaseFile, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to the SQLite database.');
            }
        });
    }

    async runQuery(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    console.error('Error running query:', err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async runQueryAll(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('Error running query:', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async runQueryExec(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    console.error('Error running query:', err.message);
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Closed the database connection.');
            }
        });
    }
}

module.exports = MySqlWrapper;