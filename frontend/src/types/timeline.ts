export type TimelineSeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type LegacyTimelineType =
  | "IMPORT"
  | "ANALYZE"
  | "EXPORT"
  | string;

export interface TimelineEvent {
  id: string;
  caseId?: string;
  evidenceId?: string;

  timestamp: string;

  source?: string;
  eventType: string;
  description?: string;

  severity: TimelineSeverity;

  rawData?: string;

  // legacy fields for old timeline components
  type?: LegacyTimelineType;
  user?: string;
  metadata?: {
    filename?: string;
    fileType?: string;
    [key: string]: unknown;
  };
}