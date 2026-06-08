export type CustodyAction =
  | "IMPORT"
  | "HASH_VERIFY"
  | "ANALYZE"
  | "MITRE_MAPPED"
  | "VIEW"
  | "EXCLUDE"
  | "RESTORE"
  | "EXPORT"
  | "REPORT_GENERATED"
  | "CASE_STATUS_CHANGED";

export interface CustodyLog {
  id: string;
  caseId: string;
  evidenceId?: string;
  action: CustodyAction;
  timestamp: string;
  user: string;
  reason?: string;
  metadata?: string;
}