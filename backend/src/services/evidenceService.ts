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
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO evidence (
        id,
        caseId,
        filename,
        fileType,
        size,
        sha256,
        importedAt,
        importedBy,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        evidence.id,
        evidence.caseId,
        evidence.filename,
        evidence.fileType,
        evidence.size,
        evidence.sha256,
        evidence.importedAt,
        evidence.importedBy,
        evidence.status || "ACTIVE",
      ],
      (err: Error | null) => {
        if (err) return reject(err);

        resolve();
      }
    );
  });
}

export function excludeEvidence(params: {
  evidenceId: string;
  excludedBy: string;
  reason: string;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE evidence
      SET
        status = 'EXCLUDED',
        excludedAt = ?,
        excludedBy = ?,
        excludeReason = ?
      WHERE id = ?
      `,
      [
        new Date().toISOString(),
        params.excludedBy,
        params.reason,
        params.evidenceId,
      ],
      (err: Error | null) => {
        if (err) return reject(err);

        resolve();
      }
    );
  });
}

export function restoreEvidence(
  evidenceId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE evidence
      SET
        status = 'ACTIVE',
        excludedAt = NULL,
        excludedBy = NULL,
        excludeReason = NULL
      WHERE id = ?
      `,
      [evidenceId],
      (err: Error | null) => {
        if (err) return reject(err);

        resolve();
      }
    );
  });
}