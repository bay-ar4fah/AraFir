import { db }
from "../database/db";

import type { Case }
from "../types/case";

export function getCases(): Promise<Case[]> {

  return new Promise((resolve, reject) => {

    db.all(
      `
      SELECT *
      FROM cases
      ORDER BY createdAt DESC
      `,
      [],
      (err, rows) => {

        if (err) {

          console.error("GET CASES ERROR:", err);

          reject(err);

          return;

        }

        resolve(rows as Case[]);

      }
    );

  });

}

export function createCase(
  forensicCase: Case
): Promise<void> {

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
      (err) => {

        if (err) {

          console.error("CREATE CASE ERROR:", err);

          reject(err);

          return;

        }

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
      (err, row) => {

        if (err) {

          console.error("GET CASE BY ID ERROR:", err);

          reject(err);

          return;

        }

        resolve(row as Case || null);

      }
    );

  });

}

export function updateCaseStatus(
  id: string,
  status: Case["status"]
): Promise<void> {

  return new Promise((resolve, reject) => {

    db.run(
      `
      UPDATE cases
      SET status = ?
      WHERE id = ?
      `,
      [status, id],
      (err) => {

        if (err) {

          console.error("UPDATE CASE ERROR:", err);

          reject(err);

          return;

        }

        resolve();

      }
    );

  });

}