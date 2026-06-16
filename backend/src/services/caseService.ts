import { db } from "../database/db";
import type { Case } from "../types/case";

export function getCases(): Promise<Case[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM cases ORDER BY createdAt DESC`,
      [],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);
        resolve(rows as Case[]);
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
        status
      ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
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

        resolve((row as Case) || null);
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
        else resolve(row as AssignableUserRow | undefined);
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