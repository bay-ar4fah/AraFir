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
  investigatorId?: string;
  investigatorName?: string;
  assignedByUserId?: string;
  assignedByName?: string;
  assignedAt?: string;
  status: string;
}