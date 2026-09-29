const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cors = require('cors');
const login = require('./routes/login');
const dashboard = require('./routes/dashboard');
const users = require('./routes/users');
const groups = require('./routes/groups');
const groupVaults = require('./routes/group-vaults');
const bcrypt = require('bcrypt');
const app = express();
const fs = require('fs');
const path = require('path');
const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations')).filter(file => file.endsWith('.sql'));
const port = 3000;

app.use(cors({
    origin: 'http://localhost:8000',
    methods: ['GET', 'POST'],
    credentials: true,
}));

app.use(express.json());

app.use(session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie:{
        // 8 hours
        maxAge: 8 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    (username, password, done) => {
        db.get('SELECT * FROM users WHERE us_username = ?', [username], (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect username.' });
            // console.log(user);
            bcrypt.compare(password, user.us_password, (err, result) => {
                if (err) return done(err);
                if (!result) return done(null, false, { message: 'Incorrect password.' });
                return done(null, user);
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
        done(err, user);
    });
});

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY, name TEXT UNIQUE, run_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP, success BOOLEAN)');
});


//run migrations


// maybe make it a child process
async function runMigrations() {
    for (const file of migrationFiles) {
        const filePath = path.join(__dirname, 'migrations', file);
        const sql = fs.readFileSync(filePath, 'utf8');

        db.get('SELECT name FROM migrations WHERE name = ?', [file], async (err, row) => {
            if (err) return console.error('Error checking migrations:', err);
            if (row) {
                console.log(`Skipping migration: ${file} (already applied)`);
                return;
            }
            

            db.exec(sql, (err) => {
                if (err) {
                    db.run('INSERT INTO migrations (name, success) VALUES (?, ?)', [file, false]);
                    console.error(`❌ Migration ${file} failed:`, err);
                } else {
                    db.run('INSERT INTO migrations (name, success) VALUES (?, ?)', [file, true]);
                    console.log(`✅ Migration applied: ${file}`);
                }
            });
        });
    }
}


runMigrations();



// Middleware to protect routes
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
}

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.status(403).send('Forbidden');
}

app.get("/check/user/is/authenticated", (req, res) => {
    let auth = req.isAuthenticated();
    if (auth) {
        res.status(200).send({ isAuthenticated: true });
    } else {
        res.status(401).send({ isAuthenticated: false });
    }
});

//routers
app.use('/login', login);
app.use(ensureAuthenticated);
app.use('/dashboard', dashboard);
app.use('/group-vaults', groupVaults);
app.use('/users', ensureAdmin, users);
app.use('/groups', ensureAdmin, groups);


const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

function shutdown() {
    server.close(() => {
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);





