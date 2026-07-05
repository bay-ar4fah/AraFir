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
        must_change_password INTEGER DEFAULT 1,
        password_updated_at TEXT,
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
        status TEXT,
        investigatorId TEXT,
        investigatorName TEXT,
        assignedByUserId TEXT,
        assignedByName TEXT,
        assignedAt TEXT
        investigationType TEXT NOT NULL DEFAULT 'MULTI_SOURCE',
        priority TEXT NOT NULL DEFAULT 'MEDIUM',
        classification TEXT NOT NULL DEFAULT 'INTERNAL',
        expectedEvidence TEXT,
        caseTags TEXT
      )
    `);

      const caseColumns = [
    {
      name: "investigationType",
      sql: "ALTER TABLE cases ADD COLUMN investigationType TEXT NOT NULL DEFAULT 'MULTI_SOURCE'",
    },
    {
      name: "priority",
      sql: "ALTER TABLE cases ADD COLUMN priority TEXT NOT NULL DEFAULT 'MEDIUM'",
    },
    {
      name: "classification",
      sql: "ALTER TABLE cases ADD COLUMN classification TEXT NOT NULL DEFAULT 'INTERNAL'",
    },
    {
      name: "expectedEvidence",
      sql: "ALTER TABLE cases ADD COLUMN expectedEvidence TEXT",
    },
    {
      name: "caseTags",
      sql: "ALTER TABLE cases ADD COLUMN caseTags TEXT",
    },
  ];

  caseColumns.forEach((column) => {
    db.all(`PRAGMA table_info(cases)`, [], (err, rows: any[]) => {
      if (err) {
        console.error(err);
        return;
      }

      const exists = rows.some(
        (row) => row.name === column.name
      );

      if (!exists) {
        db.run(column.sql);
      }
    });
  });

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

    db.run(`
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

    db.run(`
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

    db.run(`
      CREATE TABLE IF NOT EXISTS findings (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        severity TEXT NOT NULL DEFAULT 'MEDIUM',
        confidence TEXT NOT NULL DEFAULT 'MEDIUM',
        status TEXT NOT NULL DEFAULT 'OPEN',

        evidence_id TEXT,
        timeline_event_id TEXT,
        mitre_finding_id TEXT,

        technique_id TEXT,
        tactic TEXT,

        created_by TEXT NOT NULL,
        created_by_name TEXT NOT NULL,
        reviewed_by TEXT,
        reviewed_by_name TEXT,

        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        reviewed_at TEXT,

        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
        FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE SET NULL,
        FOREIGN KEY (timeline_event_id) REFERENCES timeline_events(id) ON DELETE SET NULL,
        FOREIGN KEY (mitre_finding_id) REFERENCES mitre_findings(id) ON DELETE SET NULL
      )
    `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_findings_case_id
        ON findings(case_id)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_findings_status
        ON findings(status)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_findings_severity
        ON findings(severity)
      `);

      db.run(`
        CREATE INDEX IF NOT EXISTS idx_findings_created_at
        ON findings(created_at)
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS attribution_assessments (
          id TEXT PRIMARY KEY,
          case_id TEXT NOT NULL UNIQUE,

          threat_actor TEXT,
          actor_aliases TEXT,
          campaign_name TEXT,
          motivation TEXT,
          target_sector TEXT,

          confidence TEXT NOT NULL DEFAULT 'LOW',
          attribution_status TEXT NOT NULL DEFAULT 'DRAFT',

          initial_access TEXT,
          root_cause TEXT,
          technical_root_cause TEXT,
          business_root_cause TEXT,
          process_root_cause TEXT,

          attack_objective TEXT,
          business_impact TEXT,
          data_impact TEXT,
          affected_assets TEXT,

          supporting_summary TEXT,
          contradicting_summary TEXT,
          limitations TEXT,
          final_assessment TEXT,
          recommended_remediation TEXT,

          created_by TEXT,
          created_by_name TEXT,
          updated_by TEXT,
          updated_by_name TEXT,
          reviewed_by TEXT,
          reviewed_by_name TEXT,

          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          reviewed_at TEXT,

          FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS attribution_hypotheses (
          id TEXT PRIMARY KEY,
          case_id TEXT NOT NULL,
          assessment_id TEXT NOT NULL,

          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'OPEN',
          confidence TEXT NOT NULL DEFAULT 'LOW',

          supporting_finding_ids TEXT,
          contradicting_finding_ids TEXT,
          notes TEXT,

          created_by TEXT,
          created_by_name TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,

          FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
          FOREIGN KEY (assessment_id) REFERENCES attribution_assessments(id) ON DELETE CASCADE
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS attribution_evidence_matrix (
          id TEXT PRIMARY KEY,
          case_id TEXT NOT NULL,
          assessment_id TEXT NOT NULL,

          evidence_id TEXT,
          finding_id TEXT,

          reliability TEXT NOT NULL DEFAULT 'MEDIUM',
          relevance TEXT NOT NULL DEFAULT 'MEDIUM',
          weight INTEGER NOT NULL DEFAULT 3,
          notes TEXT,

          created_by TEXT,
          created_by_name TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,

          FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
          FOREIGN KEY (assessment_id) REFERENCES attribution_assessments(id) ON DELETE CASCADE,
          FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE SET NULL,
          FOREIGN KEY (finding_id) REFERENCES findings(id) ON DELETE SET NULL
        )
      `);

      db.run(`
    CREATE TABLE IF NOT EXISTS lessons_learned (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL UNIQUE,

      incident_summary TEXT,
      what_happened TEXT,
      why_it_happened TEXT,
      what_worked TEXT,
      what_failed TEXT,
      business_impact TEXT,
      technical_impact TEXT,

      root_cause_category TEXT,
      root_cause_summary TEXT,
      control_gap_summary TEXT,

      overall_status TEXT NOT NULL DEFAULT 'DRAFT',

      created_by TEXT,
      created_by_name TEXT,
      updated_by TEXT,
      updated_by_name TEXT,
      reviewed_by TEXT,
      reviewed_by_name TEXT,

      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      reviewed_at TEXT,

      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    )
  `);

    db.run(`
    CREATE TABLE IF NOT EXISTS capa_actions (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      lessons_learned_id TEXT NOT NULL,

      action_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'MEDIUM',
      status TEXT NOT NULL DEFAULT 'OPEN',

      owner_team TEXT,
      owner_name TEXT,
      due_date TEXT,
      completed_at TEXT,
      verified_at TEXT,

      verification_notes TEXT,
      linked_finding_id TEXT,
      linked_evidence_id TEXT,

      created_by TEXT,
      created_by_name TEXT,
      updated_by TEXT,
      updated_by_name TEXT,
      verified_by TEXT,
      verified_by_name TEXT,

      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,

      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
      FOREIGN KEY (lessons_learned_id) REFERENCES lessons_learned(id) ON DELETE CASCADE,
      FOREIGN KEY (linked_finding_id) REFERENCES findings(id) ON DELETE SET NULL,
      FOREIGN KEY (linked_evidence_id) REFERENCES evidence(id) ON DELETE SET NULL
    )
  `);
      
  db.run(`
      CREATE INDEX IF NOT EXISTS idx_lessons_learned_case_id
      ON lessons_learned(case_id)
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_capa_actions_case_id
      ON capa_actions(case_id)
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_capa_actions_status
      ON capa_actions(status)
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_capa_actions_due_date
      ON capa_actions(due_date)
    `);
    console.log(
      "Database Initialized"
    );

  });

}