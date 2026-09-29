# Vault

A self-hosted password manager. Users store credentials in personal vaults, or in vaults shared with a group. Entries can be given an expiration date, which a background worker sweeps and flags automatically.

## Stack

- **frontend** — Vue 3 + Vuetify (Vite, file-based routing)
- **backend** — Express + SQLite (passport session auth)
- **worker** — standalone Node service that runs the expiration sweep on a cron schedule

Each is an independent Node project with its own `package.json`.

## Features

- Personal vaults with encrypted entries (AES-256-CBC)
- Groups with shared vaults — any group member can unlock a group's vaults
- Admin-only user management (create/delete users, grant/revoke admin)
- Admin-only group management (create groups, add/remove members)
- Entry expiration: set an expiry date on an entry, and the worker soft-expires it (flags it, doesn't delete it) once that date passes

## Getting started

Each service needs its own install and its own terminal.

```bash
cd backend && npm install
cd frontend && npm install
cd worker && npm install
```

Create `backend/.env`:

```
ENCRYPTION_KEY=some-long-random-string
```

Then run all three, each in its own terminal:

```bash
cd backend && node index.js      # http://localhost:3000
cd frontend && npm run dev       # http://localhost:8000
cd worker && npm start           # runs the hourly expiration sweep
```

On first run, the backend applies its migrations automatically and seeds an `admin` user (see `backend/migrations/003-insert_admin_user.sql`).

## Project layout

```
backend/
  classes/     domain logic (VaultHelper, UserHelper, GroupHelper), one per entity
  routes/      Express routers, one per entity
  migrations/  numbered .sql files, applied in order on startup
frontend/
  src/pages/       one file per route (file-based routing)
  src/components/  dialogs and shared UI
worker/
  classes/         ExpirationHelper (the actual sweep logic)
  cronhandler.js   schedules the sweep
```

## Notes

- The backend and worker both talk directly to `backend/database.sqlite`.
- If running the backend under `nodemon`, only one instance should hold port 3000 at a time — restarting while another instance is still up will throw `EADDRINUSE`.
