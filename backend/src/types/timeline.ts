export interface TimelineEvent {
  id: string;
  caseId: string;
  evidenceId: string;
  timestamp: string;
  source: string;
  eventType: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  rawData: string;
}