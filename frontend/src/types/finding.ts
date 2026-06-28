export type FindingSeverity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "INFO";

export type FindingConfidence =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type FindingStatus =
  | "OPEN"
  | "REVIEWED"
  | "CONFIRMED"
  | "REJECTED";

export interface Finding {
  id: string;
  caseId: string;
  title: string;
  description: string | null;
  severity: FindingSeverity;
  confidence: FindingConfidence;
  status: FindingStatus;

  evidenceId: string | null;
  timelineEventId: string | null;
  mitreFindingId: string | null;

  techniqueId: string | null;
  tactic: string | null;

  createdBy: string;
  createdByName: string;
  reviewedBy: string | null;
  reviewedByName: string | null;

  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
}

export interface CreateFindingPayload {
  title: string;
  description?: string;
  severity: FindingSeverity;
  confidence: FindingConfidence;
  evidenceId?: string | null;
  timelineEventId?: string | null;
  mitreFindingId?: string | null;
  techniqueId?: string | null;
  tactic?: string | null;
}

export interface UpdateFindingPayload {
  title?: string;
  description?: string | null;
  severity?: FindingSeverity;
  confidence?: FindingConfidence;
  status?: FindingStatus;
  evidenceId?: string | null;
  timelineEventId?: string | null;
  mitreFindingId?: string | null;
  techniqueId?: string | null;
  tactic?: string | null;
}