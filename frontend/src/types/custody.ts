export interface CustodyLog {
  id: string;
  evidenceId: string;
  action: "IMPORT" | "ANALYZE" | "EXPORT" | "VIEW";
  timestamp: string;
  user: string;
}