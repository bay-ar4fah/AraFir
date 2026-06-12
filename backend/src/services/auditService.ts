import { randomUUID } from "crypto";
import { db } from "../database/db";
import type {
  CreateAuditLogParams,
} from "../types/audit";

export function createAuditLog(
  params: CreateAuditLogParams
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO audit_logs (
        id,
        actor_user_id,
        actor_name,
        actor_email,
        actor_role,
        action,
        entity_type,
        entity_id,
        entity_name,
        case_id,
        ip_address,
        user_agent,
        status,
        message,
        metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        randomUUID(),
        params.actorUserId ?? null,
        params.actorName ?? null,
        params.actorEmail ?? null,
        params.actorRole ?? null,
        params.action,
        params.entityType ?? null,
        params.entityId ?? null,
        params.entityName ?? null,
        params.caseId ?? null,
        params.ipAddress ?? null,
        Array.isArray(params.userAgent)
          ? params.userAgent.join(", ")
          : params.userAgent ?? null,
        params.status ?? "SUCCESS",
        params.message ?? null,
        params.metadata
          ? JSON.stringify(params.metadata)
          : null,
      ],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export function getAuditLogs(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM audit_logs
      ORDER BY created_at DESC
      LIMIT 500
      `,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      }
    );
  });
}

export function getAuditLogsByCaseId(
  caseId: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM audit_logs
      WHERE case_id = ?
      ORDER BY created_at DESC
      `,
      [caseId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as any[]);
      }
    );
  });
}