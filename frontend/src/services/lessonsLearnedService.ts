import {
  getAuthHeaders,
} from "./authService";

import type {
  CreateCapaPayload,
  LessonsWorkspace,
  UpdateCapaPayload,
  UpdateLessonsPayload,
} from "../types/lessonsLearned";

const API_BASE_URL =
  "http://localhost:3001/api";

export async function getLessonsWorkspace(
  caseId: string
): Promise<LessonsWorkspace> {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/lessons`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(
      "Failed to load lessons learned workspace"
    );
  }

  return res.json();
}

export async function updateLessons(
  caseId: string,
  payload: UpdateLessonsPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/lessons`,
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
        "Failed to update lessons learned"
    );
  }

  return res.json();
}

export async function createCapaAction(
  caseId: string,
  payload: CreateCapaPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/cases/${caseId}/lessons/capa`,
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
        "Failed to create CAPA action"
    );
  }

  return res.json();
}

export async function updateCapaAction(
  capaId: string,
  payload: UpdateCapaPayload
) {
  const res = await fetch(
    `${API_BASE_URL}/lessons/capa/${capaId}`,
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
        "Failed to update CAPA action"
    );
  }
}