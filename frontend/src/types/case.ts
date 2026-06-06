export type CaseStatus =
  | "OPEN"
  | "CLOSED"
  | "ARCHIVED";

export interface Case {
  id: string;
  caseName: string;
  description: string;
  createdAt: string;
  investigator: string;
  status: CaseStatus;
}