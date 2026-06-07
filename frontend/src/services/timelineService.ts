import type {
  TimelineEvent,
} from "../types/timeline";

const API_URL = "http://localhost:3001/api";

export async function getTimelineByCaseId(
  caseId: string
): Promise<TimelineEvent[]> {
  const response = await fetch(
    `${API_URL}/cases/${caseId}/timeline`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch timeline");
  }

  return response.json();
}

// legacy helper for old hooks
export async function buildTimeline(): Promise<TimelineEvent[]> {
  return [];
}