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

export async function getAllTimelineEvents(): Promise<TimelineEvent[]> {
  const response =
    await fetch(`${API_URL}/timeline`);

  if (!response.ok) {
    throw new Error("Failed to fetch global timeline");
  }

  return response.json();
}

// legacy helper
export async function buildTimeline(): Promise<TimelineEvent[]> {
  return [];
}