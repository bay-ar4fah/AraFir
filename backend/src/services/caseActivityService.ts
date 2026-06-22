import { db } from "../database/db";
import type {
  CaseActivityItem,
} from "../types/caseActivity";

function getAuditActivities(
  caseId: string
): Promise<CaseActivityItem[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        case_id as caseId,
        'AUDIT' as source,
        action,
        actor_name as actorName,
        actor_role as actorRole,
        entity_type as entityType,
        entity_id as entityId,
        entity_name as entityName,
        message,
        NULL as reason,
        metadata,
        created_at as timestamp
      FROM audit_logs
      WHERE case_id = ?
      `,
      [caseId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as CaseActivityItem[]);
      }
    );
  });
}

function getCustodyActivities(
  caseId: string
): Promise<CaseActivityItem[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        caseId,
        'CUSTODY' as source,
        action,
        user as actorName,
        NULL as actorRole,
        'EVIDENCE' as entityType,
        evidenceId as entityId,
        NULL as entityName,
        NULL as message,
        reason,
        metadata,
        timestamp
      FROM custody_logs
      WHERE caseId = ?
      `,
      [caseId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as CaseActivityItem[]);
      }
    );
  });
}

function getAssignmentActivities(
  caseId: string
): Promise<CaseActivityItem[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        caseId,
        'ASSIGNMENT' as source,
        action,
        assignedByName as actorName,
        assignedByRole as actorRole,
        'USER' as entityType,
        assignedToUserId as entityId,
        assignedToName as entityName,
        'Case assignment changed' as message,
        reason,
        NULL as metadata,
        createdAt as timestamp
      FROM case_assignment_logs
      WHERE caseId = ?
      `,
      [caseId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as CaseActivityItem[]);
      }
    );
  });
}

function getTimelineActivities(
  caseId: string
): Promise<CaseActivityItem[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT
        id,
        caseId,
        'TIMELINE' as source,
        eventType as action,
        source as actorName,
        NULL as actorRole,
        'TIMELINE_EVENT' as entityType,
        evidenceId as entityId,
        NULL as entityName,
        description as message,
        NULL as reason,
        rawData as metadata,
        timestamp
      FROM timeline_events
      WHERE caseId = ?
      `,
      [caseId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows as CaseActivityItem[]);
      }
    );
  });
}

export async function getCaseActivities(
  caseId: string
): Promise<CaseActivityItem[]> {
  const [
    audit,
    custody,
    assignments,
    timeline,
  ] = await Promise.all([
    getAuditActivities(caseId),
    getCustodyActivities(caseId),
    getAssignmentActivities(caseId),
    getTimelineActivities(caseId),
  ]);

  return [
    ...audit,
    ...custody,
    ...assignments,
    ...timeline,
  ].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );
}