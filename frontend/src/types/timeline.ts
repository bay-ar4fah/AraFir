export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface TimelineEvent {
  id: string;
  evidenceId: string;
  type: "IMPORT" | "ANALYZE" | "EXPORT" | "VIEW";
  timestamp: string;
  user: string;

  severity: Severity;

  metadata?: {
    filename?: string;
    fileType?: string;
  };
}