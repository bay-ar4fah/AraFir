import crypto from "crypto";

import { db } from "../database/db";

import type {
  CustodyAction,
  CustodyLog,
} from "../types/custody";

export function createCustodyLog(params: {
  caseId: string;
  evidenceId?: string;
  action: CustodyAction;
  user?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const log: CustodyLog = {
    id: crypto.randomUUID(),
    caseId: params.caseId,
    evidenceId: params.evidenceId,
    action: params.action,
    timestamp: new Date().toISOString(),
    user: params.user || "Investigator",
    reason: params.reason,
    metadata: params.metadata
      ? JSON.stringify(params.metadata)
      : undefined,
  };

  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO custody_logs (
        id,
        caseId,
        evidenceId,
        action,
        timestamp,
        user,
        reason,
        metadata
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        log.id,
        log.caseId,
        log.evidenceId || null,
        log.action,
        log.timestamp,
        log.user,
        log.reason || null,
        log.metadata || null,
      ],
      (err: Error | null) => {
        if (err) return reject(err);

        resolve();
      }
    );
  });
}

export function getCustodyLogsByCaseId(
  caseId: string
): Promise<CustodyLog[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM custody_logs
      WHERE caseId = ?
      ORDER BY timestamp DESC
      `,
      [caseId],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);

        resolve(rows as CustodyLog[]);
      }
    );
  });
}

export function getCustodyLogsByEvidenceId(
  evidenceId: string
): Promise<CustodyLog[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM custody_logs
      WHERE evidenceId = ?
      ORDER BY timestamp DESC
      `,
      [evidenceId],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);

        resolve(rows as CustodyLog[]);
      }
    );
  });
}