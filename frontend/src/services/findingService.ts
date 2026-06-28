import {
  getAuthHeaders,
} from "./authService";

import type {
  CreateFindingPayload,
  Finding,
  UpdateFindingPayload,
} from "../types/finding";

const API_BASE_URL =
  "http://localhost:3001/api";

export async function getFindingsByCaseId(
  caseId: string
): Promise<Finding[]> {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/findings`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to load findings");
  }

  return res.json();
}

export async function createFinding(
  caseId: string,
  payload: CreateFindingPayload
): Promise<Finding> {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/findings`,
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
      error?.message || "Failed to create finding"
    );
  }

  return res.json();
}

export async function updateFinding(
  findingId: string,
  payload: UpdateFindingPayload
): Promise<Finding> {
  const res = await fetch(
    `${API_BASE_URL}/findings/${findingId}`,
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
      error?.message || "Failed to update finding"
    );
  }

  return res.json();
}

export async function deleteFindingById(
  findingId: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/findings/${findingId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    const error =
      await res.json().catch(() => null);

    throw new Error(
      error?.message || "Failed to delete finding"
    );
  }
}