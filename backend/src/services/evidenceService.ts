import { db }
from "../database/db";

import type { Evidence }
from "../types/evidence";

export function getEvidence() {

  return new Promise<Evidence[]>(
    (resolve, reject) => {

      db.all(
        `
        SELECT *
        FROM evidence
        ORDER BY importedAt DESC
        `,
        [],
        (err, rows) => {

          if (err) {

            reject(err);

            return;
          }

          resolve(
            rows as Evidence[]
          );

        }
      );

    }
  );

}

export function getEvidenceByCaseId(caseId: string): Promise<Evidence[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM evidence
      WHERE caseId = ?
      ORDER BY importedAt DESC
      `,
      [caseId],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);

        resolve(rows as Evidence[]);
      }
    );
  });
}

export function createEvidence(
  evidence: Evidence
) {

  return new Promise<void>(
    (resolve, reject) => {

      db.run(
        `
        INSERT INTO evidence
        (
          id,
          filename,
          fileType,
          size,
          sha256,
          importedAt,
          importedBy
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          evidence.id,
          evidence.filename,
          evidence.fileType,
          evidence.size,
          evidence.sha256,
          evidence.importedAt,
          evidence.importedBy
        ],
        (err) => {

          if (err) {

            reject(err);

            return;
          }

          resolve();

        }
      );

    }
  );

}