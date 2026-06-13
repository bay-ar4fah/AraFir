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

export function createCase(forensicCase: Case): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO cases (
        id,
        caseName,
        description,
        createdAt,
        investigator,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        forensicCase.id,
        forensicCase.caseName,
        forensicCase.description,
        forensicCase.createdAt,
        forensicCase.investigator,
        forensicCase.status
      ],
      (err: Error | null) => {
        if (err) return reject(err);
        resolve();
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