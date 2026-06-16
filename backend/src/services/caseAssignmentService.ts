import { randomUUID } from "crypto";
import { db } from "../database/db";

export function createCaseAssignmentLog(params: {
  caseId: string;
  assignedToUserId: string;
  assignedToName: string;
  assignedToRole: string;
  assignedByUserId?: string | null;
  assignedByName?: string | null;
  assignedByRole?: string | null;
  action: "ASSIGNED" | "REASSIGNED";
  reason?: string | null;
}): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO case_assignment_logs (
        id,
        caseId,
        assignedToUserId,
        assignedToName,
        assignedToRole,
        assignedByUserId,
        assignedByName,
        assignedByRole,
        action,
        reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        randomUUID(),
        params.caseId,
        params.assignedToUserId,
        params.assignedToName,
        params.assignedToRole,
        params.assignedByUserId ?? null,
        params.assignedByName ?? null,
        params.assignedByRole ?? null,
        params.action,
        params.reason ?? null,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function getCaseAssignmentLogs(
  caseId: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM case_assignment_logs
      WHERE caseId = ?
      ORDER BY createdAt DESC
      `,
      [caseId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      }
    );
  });
}