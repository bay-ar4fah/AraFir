import { randomUUID } from "crypto";

import { db } from "../database/db";

import type {
  AttributionAssessment,
  AttributionConfidence,
  AttributionEvidenceMatrixItem,
  AttributionHypothesis,
  AttributionStatus,
  AttributionWorkspace,
  CreateEvidenceMatrixInput,
  CreateHypothesisInput,
  EvidenceRating,
  HypothesisStatus,
  UpdateHypothesisInput,
  UpsertAttributionAssessmentInput,
} from "../types/attribution";

const CONFIDENCE_VALUES: AttributionConfidence[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CONFIRMED",
];

const STATUS_VALUES: AttributionStatus[] = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
];

const HYPOTHESIS_STATUS_VALUES: HypothesisStatus[] = [
  "OPEN",
  "SUPPORTED",
  "REJECTED",
  "CONFIRMED",
];

const RATING_VALUES: EvidenceRating[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "VERY_HIGH",
];

export function isAttributionConfidence(
  value: string
): value is AttributionConfidence {
  return CONFIDENCE_VALUES.includes(
    value as AttributionConfidence
  );
}

export function isAttributionStatus(
  value: string
): value is AttributionStatus {
  return STATUS_VALUES.includes(
    value as AttributionStatus
  );
}

export function isHypothesisStatus(
  value: string
): value is HypothesisStatus {
  return HYPOTHESIS_STATUS_VALUES.includes(
    value as HypothesisStatus
  );
}

export function isEvidenceRating(
  value: string
): value is EvidenceRating {
  return RATING_VALUES.includes(
    value as EvidenceRating
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

interface AssessmentRow {
  id: string;
  case_id: string;
  threat_actor: string | null;
  actor_aliases: string | null;
  campaign_name: string | null;
  motivation: string | null;
  target_sector: string | null;
  confidence: AttributionConfidence;
  attribution_status: AttributionStatus;
  initial_access: string | null;
  root_cause: string | null;
  technical_root_cause: string | null;
  business_root_cause: string | null;
  process_root_cause: string | null;
  attack_objective: string | null;
  business_impact: string | null;
  data_impact: string | null;
  affected_assets: string | null;
  supporting_summary: string | null;
  contradicting_summary: string | null;
  limitations: string | null;
  final_assessment: string | null;
  recommended_remediation: string | null;
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

interface HypothesisRow {
  id: string;
  case_id: string;
  assessment_id: string;
  title: string;
  description: string | null;
  status: HypothesisStatus;
  confidence: AttributionConfidence;
  supporting_finding_ids: string | null;
  contradicting_finding_ids: string | null;
  notes: string | null;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

interface EvidenceMatrixRow {
  id: string;
  case_id: string;
  assessment_id: string;
  evidence_id: string | null;
  finding_id: string | null;
  reliability: EvidenceRating;
  relevance: EvidenceRating;
  weight: number;
  notes: string | null;
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

function mapAssessment(
  row: AssessmentRow
): AttributionAssessment {
  return {
    id: row.id,
    caseId: row.case_id,
    threatActor: row.threat_actor,
    actorAliases: row.actor_aliases,
    campaignName: row.campaign_name,
    motivation: row.motivation,
    targetSector: row.target_sector,
    confidence: row.confidence,
    attributionStatus: row.attribution_status,
    initialAccess: row.initial_access,
    rootCause: row.root_cause,
    technicalRootCause: row.technical_root_cause,
    businessRootCause: row.business_root_cause,
    processRootCause: row.process_root_cause,
    attackObjective: row.attack_objective,
    businessImpact: row.business_impact,
    dataImpact: row.data_impact,
    affectedAssets: row.affected_assets,
    supportingSummary: row.supporting_summary,
    contradictingSummary: row.contradicting_summary,
    limitations: row.limitations,
    finalAssessment: row.final_assessment,
    recommendedRemediation:
      row.recommended_remediation,
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

function mapHypothesis(
  row: HypothesisRow
): AttributionHypothesis {
  return {
    id: row.id,
    caseId: row.case_id,
    assessmentId: row.assessment_id,
    title: row.title,
    description: row.description,
    status: row.status,
    confidence: row.confidence,
    supportingFindingIds: row.supporting_finding_ids,
    contradictingFindingIds:
      row.contradicting_finding_ids,
    notes: row.notes,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapEvidenceMatrix(
  row: EvidenceMatrixRow
): AttributionEvidenceMatrixItem {
  return {
    id: row.id,
    caseId: row.case_id,
    assessmentId: row.assessment_id,
    evidenceId: row.evidence_id,
    findingId: row.finding_id,
    reliability: row.reliability,
    relevance: row.relevance,
    weight: row.weight,
    notes: row.notes,
    createdBy: row.created_by,
    createdByName: row.created_by_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAssessmentByCaseId(
  caseId: string
): Promise<AttributionAssessment | undefined> {
  const row = await dbGet<AssessmentRow>(
    `
    SELECT *
    FROM attribution_assessments
    WHERE case_id = ?
    `,
    [caseId]
  );

  return row ? mapAssessment(row) : undefined;
}

export async function getOrCreateAssessment(
  caseId: string,
  actorUserId: string,
  actorName: string
): Promise<AttributionAssessment> {
  const existing =
    await getAssessmentByCaseId(caseId);

  if (existing) return existing;

  const id = randomUUID();
  const now = new Date().toISOString();

  await dbRun(
    `
    INSERT INTO attribution_assessments (
      id,
      case_id,
      confidence,
      attribution_status,
      created_by,
      created_by_name,
      updated_by,
      updated_by_name,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      caseId,
      "LOW",
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
    await getAssessmentByCaseId(caseId);

  if (!created) {
    throw new Error(
      "Failed to create attribution assessment"
    );
  }

  return created;
}

export async function upsertAssessment(
  input: UpsertAttributionAssessmentInput
): Promise<AttributionAssessment> {
  const existing =
    await getOrCreateAssessment(
      input.caseId,
      input.actorUserId,
      input.actorName
    );

  const reviewedAt =
    input.attributionStatus &&
    input.attributionStatus !== "DRAFT"
      ? new Date().toISOString()
      : existing.reviewedAt;

  await dbRun(
    `
    UPDATE attribution_assessments
    SET
      threat_actor = ?,
      actor_aliases = ?,
      campaign_name = ?,
      motivation = ?,
      target_sector = ?,
      confidence = ?,
      attribution_status = ?,
      initial_access = ?,
      root_cause = ?,
      technical_root_cause = ?,
      business_root_cause = ?,
      process_root_cause = ?,
      attack_objective = ?,
      business_impact = ?,
      data_impact = ?,
      affected_assets = ?,
      supporting_summary = ?,
      contradicting_summary = ?,
      limitations = ?,
      final_assessment = ?,
      recommended_remediation = ?,
      updated_by = ?,
      updated_by_name = ?,
      updated_at = ?,
      reviewed_by = ?,
      reviewed_by_name = ?,
      reviewed_at = ?
    WHERE id = ?
    `,
    [
      input.threatActor !== undefined
        ? input.threatActor
        : existing.threatActor,
      input.actorAliases !== undefined
        ? input.actorAliases
        : existing.actorAliases,
      input.campaignName !== undefined
        ? input.campaignName
        : existing.campaignName,
      input.motivation !== undefined
        ? input.motivation
        : existing.motivation,
      input.targetSector !== undefined
        ? input.targetSector
        : existing.targetSector,
      input.confidence ?? existing.confidence,
      input.attributionStatus ??
        existing.attributionStatus,
      input.initialAccess !== undefined
        ? input.initialAccess
        : existing.initialAccess,
      input.rootCause !== undefined
        ? input.rootCause
        : existing.rootCause,
      input.technicalRootCause !== undefined
        ? input.technicalRootCause
        : existing.technicalRootCause,
      input.businessRootCause !== undefined
        ? input.businessRootCause
        : existing.businessRootCause,
      input.processRootCause !== undefined
        ? input.processRootCause
        : existing.processRootCause,
      input.attackObjective !== undefined
        ? input.attackObjective
        : existing.attackObjective,
      input.businessImpact !== undefined
        ? input.businessImpact
        : existing.businessImpact,
      input.dataImpact !== undefined
        ? input.dataImpact
        : existing.dataImpact,
      input.affectedAssets !== undefined
        ? input.affectedAssets
        : existing.affectedAssets,
      input.supportingSummary !== undefined
        ? input.supportingSummary
        : existing.supportingSummary,
      input.contradictingSummary !== undefined
        ? input.contradictingSummary
        : existing.contradictingSummary,
      input.limitations !== undefined
        ? input.limitations
        : existing.limitations,
      input.finalAssessment !== undefined
        ? input.finalAssessment
        : existing.finalAssessment,
      input.recommendedRemediation !== undefined
        ? input.recommendedRemediation
        : existing.recommendedRemediation,
      input.actorUserId,
      input.actorName,
      new Date().toISOString(),
      input.attributionStatus &&
      input.attributionStatus !== "DRAFT"
        ? input.actorUserId
        : existing.reviewedBy,
      input.attributionStatus &&
      input.attributionStatus !== "DRAFT"
        ? input.actorName
        : existing.reviewedByName,
      reviewedAt,
      existing.id,
    ]
  );

  const updated =
    await getAssessmentByCaseId(input.caseId);

  if (!updated) {
    throw new Error(
      "Failed to update attribution assessment"
    );
  }

  return updated;
}

export async function getHypothesesByCaseId(
  caseId: string
): Promise<AttributionHypothesis[]> {
  const rows = await dbAll<HypothesisRow>(
    `
    SELECT *
    FROM attribution_hypotheses
    WHERE case_id = ?
    ORDER BY created_at DESC
    `,
    [caseId]
  );

  return rows.map(mapHypothesis);
}

export async function createHypothesis(
  input: CreateHypothesisInput
): Promise<AttributionHypothesis> {
  const id = randomUUID();
  const now = new Date().toISOString();

  await dbRun(
    `
    INSERT INTO attribution_hypotheses (
      id,
      case_id,
      assessment_id,
      title,
      description,
      status,
      confidence,
      created_by,
      created_by_name,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      input.caseId,
      input.assessmentId,
      input.title,
      input.description ?? null,
      "OPEN",
      input.confidence,
      input.createdBy,
      input.createdByName,
      now,
      now,
    ]
  );

  const rows =
    await getHypothesesByCaseId(input.caseId);

  const created = rows.find(
    (item) => item.id === id
  );

  if (!created) {
    throw new Error("Failed to create hypothesis");
  }

  return created;
}

export async function updateHypothesis(
  input: UpdateHypothesisInput
): Promise<void> {
  const existing = await dbGet<HypothesisRow>(
    `
    SELECT *
    FROM attribution_hypotheses
    WHERE id = ?
    `,
    [input.id]
  );

  if (!existing) {
    throw new Error("Hypothesis not found");
  }

  await dbRun(
    `
    UPDATE attribution_hypotheses
    SET
      title = ?,
      description = ?,
      status = ?,
      confidence = ?,
      notes = ?,
      supporting_finding_ids = ?,
      contradicting_finding_ids = ?,
      updated_at = ?
    WHERE id = ?
    `,
    [
      input.title ?? existing.title,
      input.description !== undefined
        ? input.description
        : existing.description,
      input.status ?? existing.status,
      input.confidence ?? existing.confidence,
      input.notes !== undefined
        ? input.notes
        : existing.notes,
      input.supportingFindingIds !== undefined
        ? input.supportingFindingIds
        : existing.supporting_finding_ids,
      input.contradictingFindingIds !== undefined
        ? input.contradictingFindingIds
        : existing.contradicting_finding_ids,
      new Date().toISOString(),
      input.id,
    ]
  );
}

export async function getEvidenceMatrixByCaseId(
  caseId: string
): Promise<AttributionEvidenceMatrixItem[]> {
  const rows = await dbAll<EvidenceMatrixRow>(
    `
    SELECT *
    FROM attribution_evidence_matrix
    WHERE case_id = ?
    ORDER BY created_at DESC
    `,
    [caseId]
  );

  return rows.map(mapEvidenceMatrix);
}

export async function createEvidenceMatrixItem(
  input: CreateEvidenceMatrixInput
): Promise<void> {
  const id = randomUUID();
  const now = new Date().toISOString();

  await dbRun(
    `
    INSERT INTO attribution_evidence_matrix (
      id,
      case_id,
      assessment_id,
      evidence_id,
      finding_id,
      reliability,
      relevance,
      weight,
      notes,
      created_by,
      created_by_name,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      input.caseId,
      input.assessmentId,
      input.evidenceId ?? null,
      input.findingId ?? null,
      input.reliability,
      input.relevance,
      input.weight,
      input.notes ?? null,
      input.createdBy,
      input.createdByName,
      now,
      now,
    ]
  );
}

export async function getAttributionWorkspace(
  caseId: string,
  actorUserId: string,
  actorName: string
): Promise<AttributionWorkspace> {
  const assessment =
    await getOrCreateAssessment(
      caseId,
      actorUserId,
      actorName
    );

  const [hypotheses, evidenceMatrix] =
    await Promise.all([
      getHypothesesByCaseId(caseId),
      getEvidenceMatrixByCaseId(caseId),
    ]);

  return {
    assessment,
    hypotheses,
    evidenceMatrix,
  };
}