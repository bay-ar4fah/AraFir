import type { TimelineEvent } from "../types/timeline";

export function calculateSeverity(
  event: Omit<TimelineEvent, "severity">
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
  
  if (event.type === "IMPORT") {
    if (event.metadata?.fileType === "MEMORY") return "CRITICAL";
    if (event.metadata?.fileType === "EVTX") return "HIGH";
    return "MEDIUM";
  }

  if (event.type === "ANALYZE") return "MEDIUM";

  if (event.type === "EXPORT") return "LOW";

  return "LOW";
}