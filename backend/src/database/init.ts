import { db } from "./db";

export function initDatabase() {

  db.serialize(() => {

    db.run(`
      CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        caseId TEXT,
        filename TEXT,
        fileType TEXT,
        size INTEGER,
        sha256 TEXT,
        importedAt TEXT,
        importedBy TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        caseName TEXT NOT NULL,
        description TEXT,
        createdAt TEXT,
        investigator TEXT,
        status TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS timeline_events (
        id TEXT PRIMARY KEY,
        caseId TEXT,
        evidenceId TEXT,
        timestamp TEXT,
        source TEXT,
        eventType TEXT,
        description TEXT,
        severity TEXT,
        rawData TEXT
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