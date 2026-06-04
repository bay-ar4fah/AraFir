import { getCustodyLogs } from "./chainOfCustodyService";
import { getEvidenceList } from "./evidenceService";
import type { TimelineEvent } from "../types/timeline";
import { calculateSeverity } from "../utils/severityEngine";

export async function buildTimeline(): Promise<TimelineEvent[]> {
  const logs = await getCustodyLogs();
  const evidence = await getEvidenceList();

  const timeline: TimelineEvent[] = logs.map((log) => {
    const ev = evidence.find((e) => e.id === log.evidenceId);

    const baseEvent = {
      id: log.id,
      evidenceId: log.evidenceId,
      type: log.action,
      timestamp: log.timestamp,
      user: log.user,
      metadata: ev
        ? {
            filename: ev.filename,
            fileType: ev.fileType,
          }
        : undefined,
    };

    return {
      ...baseEvent,
      severity: calculateSeverity(baseEvent),
    };
  });

  return timeline.sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime()
  );
}