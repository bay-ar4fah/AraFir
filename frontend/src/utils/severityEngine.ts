import type {
  TimelineEvent,
  TimelineSeverity,
} from "../types/timeline";

export function calculateSeverity(
  event: Omit<TimelineEvent, "severity">
): TimelineSeverity {
  const type =
    event.type ?? event.eventType;

  if (type === "IMPORT") {
    if (event.metadata?.fileType === "MEMORY") {
      return "CRITICAL";
    }

    if (event.metadata?.fileType === "EVTX") {
      return "HIGH";
    }

    return "LOW";
  }

  if (type === "ANALYZE") {
    return "MEDIUM";
  }

  if (type === "EXPORT") {
    return "LOW";
  }

  if (type?.includes("EVTX")) {
    return "MEDIUM";
  }

  return "LOW";
}