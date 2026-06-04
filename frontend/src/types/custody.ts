export type CustodyAction =
  | "IMPORT"
  | "ANALYZE"
  | "EXPORT"
  | "VIEW";

export interface CustodyLog {
  id: string;
  evidenceId: string;
  action: CustodyAction;
  timestamp: string;
  user: string;
}