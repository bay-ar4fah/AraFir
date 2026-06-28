import { randomUUID } from "crypto";

import { db } from "../database/db";

import type {
  CreateFindingInput,
  Finding,
  UpdateFindingInput,
  FindingSeverity,
  FindingConfidence,
  FindingStatus,
} from "../types/finding";

const ALLOWED_SEVERITY: FindingSeverity[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "INFO",
];

const ALLOWED_CONFIDENCE: FindingConfidence[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

const ALLOWED_STATUS: FindingStatus[] = [
  "OPEN",
  "REVIEWED",
  "CONFIRMED",
  "REJECTED",
];

interface FindingRow {
  id: string;
  case_id: string;
  title: string;
  description: string | null;
  severity: FindingSeverity;
  confidence: FindingConfidence;
  status: FindingStatus;
  evidence_id: string | null;
  timeline_event_id: string | null;
  mitre_finding_id: string | null;
  technique_id: string | null;
  tactic: string | null;
  created_by: string;
  created_by_name: string;
  reviewed_by: string | null;
  reviewed_by_name: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

function mapFinding(row: FindingRow): Finding {
  return {
    id: row.id,
    caseId: row.case_id,
    title: row.title,
    description: row.description,
    severity: row.severity,
    confidence: row.confidence,
    status: row.status,
    evidenceId: row.evidence_id,
    timelineEventId: row.timeline_event_id,
    mitreFindingId: row.mitre_finding_id,
    techniqueId: row.technique_id,
    tactic: row.tactic,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    reviewedBy: row.reviewed_by,
    reviewedByName: row.reviewed_by_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    reviewedAt: row.reviewed_at,
  };
}

function dbAll<T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

function dbGet<T>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

function dbRun(
  sql: string,
  params: unknown[] = []
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function validateFindingSeverity(
  severity: string
): severity is FindingSeverity {
  return ALLOWED_SEVERITY.includes(
    severity as FindingSeverity
  );
}

export function validateFindingConfidence(
  confidence: string
): confidence is FindingConfidence {
  return ALLOWED_CONFIDENCE.includes(
    confidence as FindingConfidence
  );
}

export function validateFindingStatus(
  status: string
): status is FindingStatus {
  return ALLOWED_STATUS.includes(
    status as FindingStatus
  );
}

export async function getFindingsByCaseId(
  caseId: string
): Promise<Finding[]> {
  const rows = await dbAll<FindingRow>(
    `
    SELECT *
    FROM findings
    WHERE case_id = ?
    ORDER BY
      CASE severity
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
        ELSE 5
      END,
      created_at DESC
    `,
    [caseId]
  );

  return rows.map(mapFinding);
}

export async function getRecentFindings(
  limit = 10
): Promise<Finding[]> {
  const rows = await dbAll<FindingRow>(
    `
    SELECT *
    FROM findings
    ORDER BY created_at DESC
    LIMIT ?
    `,
    [limit]
  );

  return rows.map(mapFinding);
}

export async function getFindingById(
  id: string
): Promise<Finding | undefined> {
  const row = await dbGet<FindingRow>(
    `
    SELECT *
    FROM findings
    WHERE id = ?
    `,
    [id]
  );

  return row ? mapFinding(row) : undefined;
}

export async function createFinding(
  input: CreateFindingInput
): Promise<Finding> {
  const id = randomUUID();
  const now = new Date().toISOString();

  await dbRun(
    `
    INSERT INTO findings (
      id,
      case_id,
      title,
      description,
      severity,
      confidence,
      status,
      evidence_id,
      timeline_event_id,
      mitre_finding_id,
      technique_id,
      tactic,
      created_by,
      created_by_name,
      reviewed_by,
      reviewed_by_name,
      created_at,
      updated_at,
      reviewed_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      input.caseId,
      input.title,
      input.description ?? null,
      input.severity,
      input.confidence,
      "OPEN",
      input.evidenceId ?? null,
      input.timelineEventId ?? null,
      input.mitreFindingId ?? null,
      input.techniqueId ?? null,
      input.tactic ?? null,
      input.createdBy,
      input.createdByName,
      null,
      null,
      now,
      now,
      null,
    ]
  );

  const finding = await getFindingById(id);

  if (!finding) {
    throw new Error("Failed to create finding");
  }

  return finding;
}

export async function updateFinding(
  input: UpdateFindingInput
): Promise<Finding> {
  const existing = await getFindingById(input.id);

  if (!existing) {
    throw new Error("Finding not found");
  }

  const nextStatus =
    input.status ?? existing.status;

  const reviewedAt =
    nextStatus !== "OPEN"
      ? new Date().toISOString()
      : existing.reviewedAt;

  await dbRun(
    `
    UPDATE findings
    SET
      title = ?,
      description = ?,
      severity = ?,
      confidence = ?,
      status = ?,
      evidence_id = ?,
      timeline_event_id = ?,
      mitre_finding_id = ?,
      technique_id = ?,
      tactic = ?,
      reviewed_by = ?,
      reviewed_by_name = ?,
      updated_at = ?,
      reviewed_at = ?
    WHERE id = ?
    `,
    [
      input.title ?? existing.title,
      input.description !== undefined
        ? input.description
        : existing.description,
      input.severity ?? existing.severity,
      input.confidence ?? existing.confidence,
      nextStatus,
      input.evidenceId !== undefined
        ? input.evidenceId
        : existing.evidenceId,
      input.timelineEventId !== undefined
        ? input.timelineEventId
        : existing.timelineEventId,
      input.mitreFindingId !== undefined
        ? input.mitreFindingId
        : existing.mitreFindingId,
      input.techniqueId !== undefined
        ? input.techniqueId
        : existing.techniqueId,
      input.tactic !== undefined
        ? input.tactic
        : existing.tactic,
      input.reviewedBy !== undefined
        ? input.reviewedBy
        : existing.reviewedBy,
      input.reviewedByName !== undefined
        ? input.reviewedByName
        : existing.reviewedByName,
      new Date().toISOString(),
      reviewedAt,
      input.id,
    ]
  );

  const updated = await getFindingById(input.id);

  if (!updated) {
    throw new Error("Finding not found after update");
  }

  return updated;
}

export async function deleteFinding(
  id: string
): Promise<void> {
  await dbRun(
    `
    DELETE FROM findings
    WHERE id = ?
    `,
    [id]
  );
}