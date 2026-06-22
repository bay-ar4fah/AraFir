export type CaseActivitySource =
  | "AUDIT"
  | "CUSTODY"
  | "ASSIGNMENT"
  | "TIMELINE";

export interface CaseActivityItem {
  id: string;
  caseId: string;
  source: CaseActivitySource;
  action: string;
  actorName: string | null;
  actorRole: string | null;
  entityType: string | null;
  entityId: string | null;
  entityName: string | null;
  message: string | null;
  reason: string | null;
  metadata: string | null;
  timestamp: string;
}