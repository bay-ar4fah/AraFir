import {
  getAuthHeaders,
} from "./authService";

import type {
  AttributionWorkspace,
  CreateEvidenceMatrixPayload,
  CreateHypothesisPayload,
  UpdateAttributionAssessmentPayload,
  UpdateHypothesisPayload,
} from "../types/attribution";

const API_BASE_URL =
  "http://localhost:3001/api";

export async function getAttributionWorkspace(
  caseId: string
): Promise<AttributionWorkspace> {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/attribution`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to load attribution workspace"
    );
  }

  return res.json();
}

export async function updateAttributionAssessment(
  caseId: string,
  payload: UpdateAttributionAssessmentPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/attribution`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error =
      await res.json().catch(() => null);

    throw new Error(
      error?.message ||
        "Failed to update attribution assessment"
    );
  }

  return res.json();
}

export async function createAttributionHypothesis(
  caseId: string,
  payload: CreateHypothesisPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/attribution/hypotheses`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error =
      await res.json().catch(() => null);

    throw new Error(
      error?.message ||
        "Failed to create attribution hypothesis"
    );
  }

  return res.json();
}

export async function updateAttributionHypothesis(
  hypothesisId: string,
  payload: UpdateHypothesisPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/attribution/hypotheses/${hypothesisId}`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error =
      await res.json().catch(() => null);

    throw new Error(
      error?.message ||
        "Failed to update attribution hypothesis"
    );
  }
}

export async function createEvidenceMatrixItem(
  caseId: string,
  payload: CreateEvidenceMatrixPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/attribution/evidence-matrix`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const error =
      await res.json().catch(() => null);

    throw new Error(
      error?.message ||
        "Failed to create evidence matrix item"
    );
  }
}