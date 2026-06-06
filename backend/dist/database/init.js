"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
const db_1 = require("./db");
function initDatabase() {
    db_1.db.serialize(() => {
        db_1.db.run(`
      CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        filename TEXT,
        fileType TEXT,
        size INTEGER,
        sha256 TEXT,
        importedAt TEXT,
        importedBy TEXT
      )
    `);
        db_1.db.run(`
      CREATE TABLE IF NOT EXISTS custody_logs (
        id TEXT PRIMARY KEY,
        evidenceId TEXT,
        action TEXT,
        timestamp TEXT,
        user TEXT
      )
    `);
        console.log("Database Initialized");
    });
}
