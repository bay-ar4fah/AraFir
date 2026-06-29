import { randomUUID } from "crypto";

import { db } from "../database/db";

import type {
  CapaAction,
  CapaActionType,
  CapaPriority,
  CapaStatus,
  CreateCapaActionInput,
  LessonsLearned,
  LessonsRootCauseCategory,
  LessonsStatus,
  LessonsWorkspace,
  UpdateCapaActionInput,
  UpsertLessonsInput,
} from "../types/lessonsLearned";

const ROOT_CAUSE_VALUES: LessonsRootCauseCategory[] = [
  "TECHNICAL",
  "PROCESS",
  "HUMAN",
  "BUSINESS",
  "THIRD_PARTY",
  "PHYSICAL",
  "UNKNOWN",
];

const LESSONS_STATUS_VALUES: LessonsStatus[] = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
];

const CAPA_ACTION_TYPES: CapaActionType[] = [
  "CORRECTIVE",
  "PREVENTIVE",
];

const CAPA_PRIORITIES: CapaPriority[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
];

const CAPA_STATUSES: CapaStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "PENDING_VERIFICATION",
  "VERIFIED",
  "REJECTED",
];

export function isRootCauseCategory(
  value: string
): value is LessonsRootCauseCategory {
  return ROOT_CAUSE_VALUES.includes(
    value as LessonsRootCauseCategory
  );
}

export function isLessonsStatus(
  value: string
): value is LessonsStatus {
  return LESSONS_STATUS_VALUES.includes(
    value as LessonsStatus
  );
}

export function isCapaActionType(
  value: string
): value is CapaActionType {
  return CAPA_ACTION_TYPES.includes(
    value as CapaActionType
  );
}

export function isCapaPriority(
  value: string
): value is CapaPriority {
  return CAPA_PRIORITIES.includes(
    value as CapaPriority
  );
}

export function isCapaStatus(
  value: string
): value is CapaStatus {
  return CAPA_STATUSES.includes(
    value as CapaStatus
  );
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

interface LessonsRow {
  id: string;
  case_id: string;
  incident_summary: string | null;
  what_happened: string | null;
  why_it_happened: string | null;
  what_worked: string | null;
  what_failed: string | null;
  business_impact: string | null;
  technical_impact: string | null;
  root_cause_category:
    | LessonsRootCauseCategory
    | null;
  root_cause_summary: string | null;
  control_gap_summary: string | null;
  overall_status: LessonsStatus;
  created_by: string | null;
  created_by_name: string | null;
  updated_by: string | null;
  updated_by_name: string | null;
  reviewed_by: string | null;
  reviewed_by_name: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

interface CapaRow {
  id: string;
  case_id: string;
  lessons_learned_id: string;
  action_type: CapaActionType;
  title: string;
  description: string | null;
  priority: CapaPriority;
  status: CapaStatus;
  owner_team: string | null;
  owner_name: string | null;
  due_date: string | null;
  completed_at: string | null;
  verified_at: string | null;
  verification_notes: string | null;
  linked_finding_id: string | null;
  linked_evidence_id: string | null;
  created_by: string | null;
  created_by_name: string | null;
  updated_by: string | null;
  updated_by_name: string | null;
  verified_by: string | null;
  verified_by_name: string | null;
  created_at: string;
  updated_at: string;
}

function mapLessons(row: LessonsRow): LessonsLearned {
  return {
    id: row.id,
    caseId: row.case_id,
    incidentSummary: row.incident_summary,
    whatHappened: row.what_happened,
    whyItHappened: row.why_it_happened,
    whatWorked: row.what_worked,
    whatFailed: row.what_failed,
    businessImpact: row.business_impact,
    technicalImpact: row.technical_impact,
    rootCauseCategory:
      row.root_cause_category,
    rootCauseSummary:
      row.root_cause_summary,
    controlGapSummary:
      row.control_gap_summary,
    overallStatus: row.overall_status,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    updatedBy: row.updated_by,
    updatedByName: row.updated_by_name,
    reviewedBy: row.reviewed_by,
    reviewedByName: row.reviewed_by_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    reviewedAt: row.reviewed_at,
  };
}

function mapCapa(row: CapaRow): CapaAction {
  return {
    id: row.id,
    caseId: row.case_id,
    lessonsLearnedId:
      row.lessons_learned_id,
    actionType: row.action_type,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    ownerTeam: row.owner_team,
    ownerName: row.owner_name,
    dueDate: row.due_date,
    completedAt: row.completed_at,
    verifiedAt: row.verified_at,
    verificationNotes:
      row.verification_notes,
    linkedFindingId:
      row.linked_finding_id,
    linkedEvidenceId:
      row.linked_evidence_id,
    createdBy: row.created_by,
    createdByName:
      row.created_by_name,
    updatedBy: row.updated_by,
    updatedByName:
      row.updated_by_name,
    verifiedBy: row.verified_by,
    verifiedByName:
      row.verified_by_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getLessonsByCaseId(
  caseId: string
): Promise<LessonsLearned | undefined> {
  const row = await dbGet<LessonsRow>(
    `
    SELECT *
    FROM lessons_learned
    WHERE case_id = ?
    `,
    [caseId]
  );

  return row ? mapLessons(row) : undefined;
}

export async function getOrCreateLessons(
  caseId: string,
  actorUserId: string,
  actorName: string
): Promise<LessonsLearned> {
  const existing =
    await getLessonsByCaseId(caseId);

  if (existing) return existing;

  const id = randomUUID();
  const now = new Date().toISOString();

  await dbRun(
    `
    INSERT INTO lessons_learned (
      id,
      case_id,
      overall_status,
      created_by,
      created_by_name,
      updated_by,
      updated_by_name,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      caseId,
      "DRAFT",
      actorUserId,
      actorName,
      actorUserId,
      actorName,
      now,
      now,
    ]
  );

  const created =
    await getLessonsByCaseId(caseId);

  if (!created) {
    throw new Error(
      "Failed to create lessons learned"
    );
  }

  return created;
}

export async function upsertLessons(
  input: UpsertLessonsInput
): Promise<LessonsLearned> {
  const existing =
    await getOrCreateLessons(
      input.caseId,
      input.actorUserId,
      input.actorName
    );

  const shouldReview =
    input.overallStatus &&
    input.overallStatus !== "DRAFT";

  await dbRun(
    `
    UPDATE lessons_learned
    SET
      incident_summary = ?,
      what_happened = ?,
      why_it_happened = ?,
      what_worked = ?,
      what_failed = ?,
      business_impact = ?,
      technical_impact = ?,
      root_cause_category = ?,
      root_cause_summary = ?,
      control_gap_summary = ?,
      overall_status = ?,
      updated_by = ?,
      updated_by_name = ?,
      updated_at = ?,
      reviewed_by = ?,
      reviewed_by_name = ?,
      reviewed_at = ?
    WHERE id = ?
    `,
    [
      input.incidentSummary !== undefined
        ? input.incidentSummary
        : existing.incidentSummary,
      input.whatHappened !== undefined
        ? input.whatHappened
        : existing.whatHappened,
      input.whyItHappened !== undefined
        ? input.whyItHappened
        : existing.whyItHappened,
      input.whatWorked !== undefined
        ? input.whatWorked
        : existing.whatWorked,
      input.whatFailed !== undefined
        ? input.whatFailed
        : existing.whatFailed,
      input.businessImpact !== undefined
        ? input.businessImpact
        : existing.businessImpact,
      input.technicalImpact !== undefined
        ? input.technicalImpact
        : existing.technicalImpact,
      input.rootCauseCategory !== undefined
        ? input.rootCauseCategory
        : existing.rootCauseCategory,
      input.rootCauseSummary !== undefined
        ? input.rootCauseSummary
        : existing.rootCauseSummary,
      input.controlGapSummary !== undefined
        ? input.controlGapSummary
        : existing.controlGapSummary,
      input.overallStatus ??
        existing.overallStatus,
      input.actorUserId,
      input.actorName,
      new Date().toISOString(),
      shouldReview
        ? input.actorUserId
        : existing.reviewedBy,
      shouldReview
        ? input.actorName
        : existing.reviewedByName,
      shouldReview
        ? new Date().toISOString()
        : existing.reviewedAt,
      existing.id,
    ]
  );

  const updated =
    await getLessonsByCaseId(input.caseId);

  if (!updated) {
    throw new Error(
      "Failed to update lessons learned"
    );
  }

  return updated;
}

export async function getCapaActionsByCaseId(
  caseId: string
): Promise<CapaAction[]> {
  const rows = await dbAll<CapaRow>(
    `
    SELECT *
    FROM capa_actions
    WHERE case_id = ?
    ORDER BY
      CASE priority
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        ELSE 4
      END,
      due_date ASC
    `,
    [caseId]
  );

  return rows.map(mapCapa);
}

export async function createCapaAction(
  input: CreateCapaActionInput
): Promise<CapaAction> {
  const id = randomUUID();
  const now = new Date().toISOString();

  await dbRun(
    `
    INSERT INTO capa_actions (
      id,
      case_id,
      lessons_learned_id,
      action_type,
      title,
      description,
      priority,
      status,
      owner_team,
      owner_name,
      due_date,
      linked_finding_id,
      linked_evidence_id,
      created_by,
      created_by_name,
      updated_by,
      updated_by_name,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      input.caseId,
      input.lessonsLearnedId,
      input.actionType,
      input.title,
      input.description ?? null,
      input.priority,
      "OPEN",
      input.ownerTeam ?? null,
      input.ownerName ?? null,
      input.dueDate ?? null,
      input.linkedFindingId ?? null,
      input.linkedEvidenceId ?? null,
      input.createdBy,
      input.createdByName,
      input.createdBy,
      input.createdByName,
      now,
      now,
    ]
  );

  const rows =
    await getCapaActionsByCaseId(input.caseId);

  const created = rows.find(
    (item) => item.id === id
  );

  if (!created) {
    throw new Error(
      "Failed to create CAPA action"
    );
  }

  return created;
}

export async function updateCapaAction(
  input: UpdateCapaActionInput
): Promise<void> {
  const existing = await dbGet<CapaRow>(
    `
    SELECT *
    FROM capa_actions
    WHERE id = ?
    `,
    [input.id]
  );

  if (!existing) {
    throw new Error("CAPA action not found");
  }

  const nextStatus =
    input.status ?? existing.status;

  await dbRun(
    `
    UPDATE capa_actions
    SET
      title = ?,
      description = ?,
      priority = ?,
      status = ?,
      owner_team = ?,
      owner_name = ?,
      due_date = ?,
      completed_at = ?,
      verified_at = ?,
      verification_notes = ?,
      linked_finding_id = ?,
      linked_evidence_id = ?,
      updated_by = ?,
      updated_by_name = ?,
      verified_by = ?,
      verified_by_name = ?,
      updated_at = ?
    WHERE id = ?
    `,
    [
      input.title ?? existing.title,
      input.description !== undefined
        ? input.description
        : existing.description,
      input.priority ?? existing.priority,
      nextStatus,
      input.ownerTeam !== undefined
        ? input.ownerTeam
        : existing.owner_team,
      input.ownerName !== undefined
        ? input.ownerName
        : existing.owner_name,
      input.dueDate !== undefined
        ? input.dueDate
        : existing.due_date,
      nextStatus === "PENDING_VERIFICATION" ||
      nextStatus === "VERIFIED"
        ? new Date().toISOString()
        : existing.completed_at,
      nextStatus === "VERIFIED"
        ? new Date().toISOString()
        : existing.verified_at,
      input.verificationNotes !== undefined
        ? input.verificationNotes
        : existing.verification_notes,
      input.linkedFindingId !== undefined
        ? input.linkedFindingId
        : existing.linked_finding_id,
      input.linkedEvidenceId !== undefined
        ? input.linkedEvidenceId
        : existing.linked_evidence_id,
      input.updatedBy,
      input.updatedByName,
      nextStatus === "VERIFIED"
        ? input.verifiedBy
        : existing.verified_by,
      nextStatus === "VERIFIED"
        ? input.verifiedByName
        : existing.verified_by_name,
      new Date().toISOString(),
      input.id,
    ]
  );
}

export async function getLessonsWorkspace(
  caseId: string,
  actorUserId: string,
  actorName: string
): Promise<LessonsWorkspace> {
  const lessons =
    await getOrCreateLessons(
      caseId,
      actorUserId,
      actorName
    );

  const capaActions =
    await getCapaActionsByCaseId(caseId);

  return {
    lessons,
    capaActions,
  };
}