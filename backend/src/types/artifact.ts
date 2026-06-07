import type { TimelineEvent } from "./timeline";

export interface ArtifactParseResult {
  evidenceId: string;
  caseId: string;
  parser: string;
  events: TimelineEvent[];
}