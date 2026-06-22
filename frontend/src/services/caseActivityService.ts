import {
  getAuthHeaders,
} from "./authService";

import type {
  CaseActivityItem,
} from "../types/caseActivity";

const API_URL =
  "http://localhost:3001/api";

export async function getCaseActivities(
  caseId: string
): Promise<CaseActivityItem[]> {
  const response = await fetch(
    `${API_URL}/cases/${caseId}/activity`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error =
      await response.json().catch(() => null);

    throw new Error(
      error?.error ||
      error?.message ||
      "Failed to load case activities"
    );
  }

  return response.json();
}