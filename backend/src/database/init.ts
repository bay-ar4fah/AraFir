import { db } from "./db";

export function initDatabase() {

  db.serialize(() => {

    db.run(`
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

    db.run(`
      CREATE TABLE IF NOT EXISTS custody_logs (
        id TEXT PRIMARY KEY,
        evidenceId TEXT,
        action TEXT,
        timestamp TEXT,
        user TEXT
      )
    `);

    console.log(
      "Database Initialized"
    );

  });

}