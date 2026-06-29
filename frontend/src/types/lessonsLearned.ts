export type LessonsRootCauseCategory =
  | "TECHNICAL"
  | "PROCESS"
  | "HUMAN"
  | "BUSINESS"
  | "THIRD_PARTY"
  | "PHYSICAL"
  | "UNKNOWN";

export type LessonsStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "REJECTED";

export type CapaActionType =
  | "CORRECTIVE"
  | "PREVENTIVE";

export type CapaPriority =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type CapaStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "REJECTED";

export interface LessonsLearned {
  id: string;
  caseId: string;

  incidentSummary: string | null;
  whatHappened: string | null;
  whyItHappened: string | null;
  whatWorked: string | null;
  whatFailed: string | null;
  businessImpact: string | null;
  technicalImpact: string | null;

  rootCauseCategory: LessonsRootCauseCategory | null;
  rootCauseSummary: string | null;
  controlGapSummary: string | null;

  overallStatus: LessonsStatus;

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

export interface CapaAction {
  id: string;
  caseId: string;
  lessonsLearnedId: string;

  actionType: CapaActionType;
  title: string;
  description: string | null;
  priority: CapaPriority;
  status: CapaStatus;

  ownerTeam: string | null;
  ownerName: string | null;
  dueDate: string | null;
  completedAt: string | null;
  verifiedAt: string | null;

  verificationNotes: string | null;
  linkedFindingId: string | null;
  linkedEvidenceId: string | null;

  createdBy: string | null;
  createdByName: string | null;
  updatedBy: string | null;
  updatedByName: string | null;
  verifiedBy: string | null;
  verifiedByName: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface LessonsWorkspace {
  lessons: LessonsLearned;
  capaActions: CapaAction[];
}

export interface UpdateLessonsPayload {
  incidentSummary?: string | null;
  whatHappened?: string | null;
  whyItHappened?: string | null;
  whatWorked?: string | null;
  whatFailed?: string | null;
  businessImpact?: string | null;
  technicalImpact?: string | null;
  rootCauseCategory?: LessonsRootCauseCategory | null;
  rootCauseSummary?: string | null;
  controlGapSummary?: string | null;
  overallStatus?: LessonsStatus;
}

export interface CreateCapaPayload {
  lessonsLearnedId: string;
  actionType: CapaActionType;
  title: string;
  description?: string | null;
  priority: CapaPriority;
  ownerTeam?: string | null;
  ownerName?: string | null;
  dueDate?: string | null;
  linkedFindingId?: string | null;
  linkedEvidenceId?: string | null;
}

export interface UpdateCapaPayload {
  title?: string;
  description?: string | null;
  priority?: CapaPriority;
  status?: CapaStatus;
  ownerTeam?: string | null;
  ownerName?: string | null;
  dueDate?: string | null;
  verificationNotes?: string | null;
  linkedFindingId?: string | null;
  linkedEvidenceId?: string | null;
}