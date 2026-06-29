export interface CaseAttributionProjection {
  caseId: string;
  threatActor: string | null;
  campaignName: string | null;
  confidence: string | null;
  attributionStatus: string | null;
  initialAccess: string | null;
  rootCause: string | null;
  finalAssessment: string | null;
  recommendedRemediation: string | null;
  updatedAt: string | null;
}

export interface CaseCardAttributionProjection {
  caseId: string;
  threatActor: string | null;
  campaignName: string | null;
  confidence: string | null;
  attributionStatus: string | null;
}