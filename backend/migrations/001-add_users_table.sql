CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    us_syskey TEXT UNIQUE  DEFAULT (lower(hex(randomblob(16)))), 
    us_username TEXT UNIQUE, 
    us_password TEXT, admin BOOLEAN);