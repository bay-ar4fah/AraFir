import {
  getAuthHeaders,
} from "./authService";

import type {
  CaseAttributionProjection,
  CaseCardAttributionProjection,
} from "../types/attributionProjection";

const API_BASE_URL =
  "http://localhost:3001/api";

export async function getCaseAttributionProjection(
  caseId: string
): Promise<CaseAttributionProjection> {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/attribution/summary`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to load attribution projection"
    );
  }

  return res.json();
}

export async function getCaseCardsAttributionProjection():
  Promise<CaseCardAttributionProjection[]> {
  const res = await fetch(
    `${API_BASE_URL}/cases-attribution-summary`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to load case attribution projection"
    );
  }

  return res.json();
}