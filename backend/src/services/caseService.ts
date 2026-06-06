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