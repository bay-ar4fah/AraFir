import { db } from "../database/db";

import type {
  Case,
  InvestigationType,
  CasePriority,
  CaseClassification,
} from "../types/case";

interface CaseRow {
  id: string;
  caseName: string;
  description: string;
  createdAt: string;
  investigator: string;
  investigatorId?: string | null;
  investigatorName?: string | null;
  assignedByUserId?: string | null;
  assignedByName?: string | null;
  assignedAt?: string | null;
  status: Case["status"];
  investigationType?: string | null;
  priority?: string | null;
  classification?: string | null;
  expectedEvidence?: string | null;
  caseTags?: string | null;
}

function mapCase(row: CaseRow): Case {
  return {
    id: row.id,
    caseName: row.caseName,
    description: row.description,

    investigator: row.investigator,

    investigatorId:
      row.investigatorId ?? undefined,

    investigatorName:
      row.investigatorName ?? undefined,

    assignedByUserId:
      row.assignedByUserId ?? undefined,

    assignedByName:
      row.assignedByName ?? undefined,

    assignedAt:
      row.assignedAt ?? undefined,

    createdAt: row.createdAt,

    status: row.status,

    investigationType:
      (row.investigationType ??
        "MULTI_SOURCE") as InvestigationType,

    priority:
      (row.priority ??
        "MEDIUM") as CasePriority,

    classification:
      (row.classification ??
        "INTERNAL") as CaseClassification,

    expectedEvidence:
      row.expectedEvidence ?? null,

    caseTags:
      row.caseTags ?? null,
  };
}

export function getCases(): Promise<Case[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM cases
      ORDER BY createdAt DESC
      `,
      [],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);

        resolve(
          (rows as CaseRow[]).map(mapCase)
        );
      }
    );
  });
}

export function createCase(params: {
  id: string;
  caseName: string;
  description: string;
  investigatorId: string;
  investigatorName: string;
  assignedByUserId: string;
  assignedByName: string;
  status: string;
  investigationType: string;
  priority: string;
  classification: string;
  expectedEvidence: string | null;
  caseTags: string | null;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO cases (
        id,
        caseName,
        description,
        createdAt,
        investigator,
        investigatorId,
        investigatorName,
        assignedByUserId,
        assignedByName,
        assignedAt,
        status,
        investigationType,
        priority,
        classification,
        expectedEvidence,
        caseTags
      )
      VALUES (
        ?,
        ?,
        ?,
        CURRENT_TIMESTAMP,
        ?,
        ?,
        ?,
        ?,
        ?,
        CURRENT_TIMESTAMP,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
      `,
      [
        params.id,
        params.caseName,
        params.description,
        params.investigatorName,
        params.investigatorId,
        params.investigatorName,
        params.assignedByUserId,
        params.assignedByName,
        params.status,
        params.investigationType,
        params.priority,
        params.classification,
        params.expectedEvidence,
        params.caseTags,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function getCaseById(
  id: string
): Promise<Case | null> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM cases
      WHERE id = ?
      `,
      [id],
      (err: Error | null, row: unknown) => {
        if (err) return reject(err);

        if (!row) {
          resolve(null);
          return;
        }

        resolve(
          mapCase(row as CaseRow)
        );
      }
    );
  });
}

export function deleteCaseCascade(
  caseId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `DELETE FROM evidence WHERE caseId = ?`,
        [caseId]
      );

      db.run(
        `DELETE FROM timeline_events WHERE caseId = ?`,
        [caseId]
      );

      db.run(
        `DELETE FROM mitre_findings WHERE caseId = ?`,
        [caseId]
      );

      db.run(
        `DELETE FROM custody_logs WHERE caseId = ?`,
        [caseId]
      );

      db.run(
        `DELETE FROM cases WHERE id = ?`,
        [caseId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
}

export interface AssignableUserRow {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function getAssignableUserById(
  userId: string
): Promise<AssignableUserRow | undefined> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT id, name, email, role
      FROM users
      WHERE id = ?
        AND is_active = 1
        AND role IN ('DFIR_MANAGER', 'INVESTIGATOR')
      `,
      [userId],
      (err, row) => {
        if (err) reject(err);
        else {
          resolve(
            row as AssignableUserRow | undefined
          );
        }
      }
    );
  });
}

export function reassignCase(params: {
  caseId: string;
  investigatorId: string;
  investigatorName: string;
  assignedByUserId: string;
  assignedByName: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE cases
      SET
        investigator = ?,
        investigatorId = ?,
        investigatorName = ?,
        assignedByUserId = ?,
        assignedByName = ?,
        assignedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        params.investigatorName,
        params.investigatorId,
        params.investigatorName,
        params.assignedByUserId,
        params.assignedByName,
        params.caseId,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}