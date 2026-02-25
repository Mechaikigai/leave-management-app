const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./leave.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS leaves(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      startDate TEXT,
      endDate TEXT,
      reason TEXT,
      status TEXT DEFAULT 'pending'
    )
  `);
});

module.exports = db;