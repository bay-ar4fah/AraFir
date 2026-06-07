export interface MitreFinding {
  id: string;
  caseId: string;
  evidenceId: string;
  timelineEventId: string;
  tactic: string;
  techniqueId: string;
  techniqueName: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: "LOW" | "MEDIUM" | "HIGH";
  description: string;
  createdAt: string;
}