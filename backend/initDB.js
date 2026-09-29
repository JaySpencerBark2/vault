const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

//create a initDB.js file class
module.exports = class InitDB {
    
   static async createInitalTables() {
        console.log('Creating inital tables');

        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT UNIQUE, password TEXT, role TEXT)');
            db.run('CREATE TABLE IF NOT EXISTS links (id INTEGER PRIMARY KEY, url TEXT, description TEXT, userId INTEGER)');
        });

    }



}
