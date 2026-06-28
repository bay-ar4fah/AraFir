export type AttributionConfidence =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CONFIRMED";

export type AttributionStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type HypothesisStatus =
  | "OPEN"
  | "SUPPORTED"
  | "REJECTED"
  | "CONFIRMED";

export type EvidenceRating =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "VERY_HIGH";

export interface AttributionAssessment {
  id: string;
  caseId: string;

  threatActor: string | null;
  actorAliases: string | null;
  campaignName: string | null;
  motivation: string | null;
  targetSector: string | null;

  confidence: AttributionConfidence;
  attributionStatus: AttributionStatus;

  initialAccess: string | null;
  rootCause: string | null;
  technicalRootCause: string | null;
  businessRootCause: string | null;
  processRootCause: string | null;

  attackObjective: string | null;
  businessImpact: string | null;
  dataImpact: string | null;
  affectedAssets: string | null;

  supportingSummary: string | null;
  contradictingSummary: string | null;
  limitations: string | null;
  finalAssessment: string | null;
  recommendedRemediation: string | null;

  createdBy: string | null;
  createdByName: string | null;
  updatedBy: string | null;
  updatedByName: string | null;
  reviewedBy: string | null;
  reviewedByName: string | null;

  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
}

export interface AttributionHypothesis {
  id: string;
  caseId: string;
  assessmentId: string;

  title: string;
  description: string | null;
  status: HypothesisStatus;
  confidence: AttributionConfidence;

  supportingFindingIds: string | null;
  contradictingFindingIds: string | null;
  notes: string | null;

  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttributionEvidenceMatrixItem {
  id: string;
  caseId: string;
  assessmentId: string;

  evidenceId: string | null;
  findingId: string | null;

  reliability: EvidenceRating;
  relevance: EvidenceRating;
  weight: number;
  notes: string | null;

  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttributionWorkspace {
  assessment: AttributionAssessment;
  hypotheses: AttributionHypothesis[];
  evidenceMatrix: AttributionEvidenceMatrixItem[];
}

export interface UpdateAttributionAssessmentPayload {
  threatActor?: string | null;
  actorAliases?: string | null;
  campaignName?: string | null;
  motivation?: string | null;
  targetSector?: string | null;
  confidence?: AttributionConfidence;
  attributionStatus?: AttributionStatus;
  initialAccess?: string | null;
  rootCause?: string | null;
  technicalRootCause?: string | null;
  businessRootCause?: string | null;
  processRootCause?: string | null;
  attackObjective?: string | null;
  businessImpact?: string | null;
  dataImpact?: string | null;
  affectedAssets?: string | null;
  supportingSummary?: string | null;
  contradictingSummary?: string | null;
  limitations?: string | null;
  finalAssessment?: string | null;
  recommendedRemediation?: string | null;
}

export interface CreateHypothesisPayload {
  assessmentId: string;
  title: string;
  description?: string | null;
  confidence: AttributionConfidence;
}

export interface UpdateHypothesisPayload {
  title?: string;
  description?: string | null;
  status?: HypothesisStatus;
  confidence?: AttributionConfidence;
  notes?: string | null;
  supportingFindingIds?: string | null;
  contradictingFindingIds?: string | null;
}

export interface CreateEvidenceMatrixPayload {
  assessmentId: string;
  evidenceId?: string | null;
  findingId?: string | null;
  reliability: EvidenceRating;
  relevance: EvidenceRating;
  weight: number;
  notes?: string | null;
}