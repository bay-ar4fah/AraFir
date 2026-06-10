import { db } from "./db";

export function initDatabase() {

  db.serialize(() => {

    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS evidence (
        id TEXT PRIMARY KEY,
        caseId TEXT,
        filename TEXT,
        fileType TEXT,
        size INTEGER,
        sha256 TEXT,
        importedAt TEXT,
        importedBy TEXT,
        status TEXT DEFAULT 'ACTIVE',
        excludedAt TEXT,
        excludedBy TEXT,
        excludeReason TEXT,
        restoredAt TEXT,
        restoredBy TEXT,
        restoreReason TEXT
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
      CREATE TABLE IF NOT EXISTS mitre_findings (
        id TEXT PRIMARY KEY,
        caseId TEXT,
        evidenceId TEXT,
        timelineEventId TEXT,
        tactic TEXT,
        techniqueId TEXT,
        techniqueName TEXT,
        severity TEXT,
        confidence TEXT,
        description TEXT,
        createdAt TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS custody_logs (
        id TEXT PRIMARY KEY,
        caseId TEXT,
        evidenceId TEXT,
        action TEXT,
        timestamp TEXT,
        user TEXT,
        reason TEXT,
        metadata TEXT
      )
    `);

    console.log(
      "Database Initialized"
    );

  });

}