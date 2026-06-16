"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
const db_1 = require("./db");
function initDatabase() {
    db_1.db.serialize(() => {
        db_1.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        must_change_password INTEGER DEFAULT 1,
        password_updated_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
        db_1.db.run(`
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
        db_1.db.run(`
      CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        caseName TEXT NOT NULL,
        description TEXT,
        createdAt TEXT,
        investigator TEXT,
        status TEXT,
        investigatorId TEXT,
        investigatorName TEXT,
        assignedByUserId TEXT,
        assignedByName TEXT,
        assignedAt TEXT
      )
    `);
        db_1.db.run(`
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
        db_1.db.run(`
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
        db_1.db.run(`
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
        db_1.db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_user_id TEXT,
      actor_name TEXT,
      actor_email TEXT,
      actor_role TEXT,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id TEXT,
      entity_name TEXT,
      case_id TEXT,
      ip_address TEXT,
      user_agent TEXT,
      status TEXT DEFAULT 'SUCCESS',
      message TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
        db_1.db.run(`
      CREATE TABLE IF NOT EXISTS case_assignment_logs (
        id TEXT PRIMARY KEY,
        caseId TEXT NOT NULL,
        assignedToUserId TEXT NOT NULL,
        assignedToName TEXT NOT NULL,
        assignedToRole TEXT NOT NULL,
        assignedByUserId TEXT,
        assignedByName TEXT,
        assignedByRole TEXT,
        action TEXT NOT NULL,
        reason TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log("Database Initialized");
    });
}
