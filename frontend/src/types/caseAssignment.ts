export interface CaseAssignmentLog {
  id: string;
  caseId: string;
  assignedToUserId: string;
  assignedToName: string;
  assignedToRole: string;
  assignedByUserId: string | null;
  assignedByName: string | null;
  assignedByRole: string | null;
  action: "ASSIGNED" | "REASSIGNED";
  reason: string | null;
  createdAt: string;
}