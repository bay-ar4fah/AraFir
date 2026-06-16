import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:3001/api";

export async function getEvidence() {
  const response = await fetch(
    `${API_URL}/evidence`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch evidence");
  }

  return response.json();
}

export async function getEvidenceList() {
  return getEvidence();
}
export async function getEvidenceByCaseId(
  caseId: string
) {
  const response = await fetch(
    `${API_URL}/cases/${caseId}/evidence`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch case evidence");
  }

  return response.json();
}

export async function excludeEvidence(params: {
  evidenceId: string;
  caseId: string;
  reason: string;
}): Promise<void> {
  const response = await fetch(
    `${API_URL}/evidence/${params.evidenceId}/exclude`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        caseId: params.caseId,
        reason: params.reason,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to exclude evidence");
  }
}

export async function restoreEvidence(
  evidenceId: string,
  caseId: string,
  reason?: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/evidence/${evidenceId}/restore`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        caseId,
        reason,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to restore evidence");
  }
}