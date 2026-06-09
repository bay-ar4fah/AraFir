import type { Evidence } from "../types/evidence";

const API_URL = "http://localhost:3001/api";

export async function getEvidenceList(): Promise<Evidence[]> {
  const response = await fetch(`${API_URL}/evidence`);

  if (!response.ok) {
    throw new Error("Failed to fetch evidence");
  }

  return response.json();
}

export async function getEvidenceByCaseId(
  caseId: string
): Promise<Evidence[]> {
  const response = await fetch(
    `${API_URL}/cases/${caseId}/evidence`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch case evidence");
  }

  return response.json();
}

export async function saveEvidence(
  evidence: Evidence
): Promise<void> {
  const response = await fetch(`${API_URL}/evidence`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(evidence),
  });

  if (!response.ok) {
    throw new Error("Failed to save evidence");
  }
}

export async function excludeEvidence(params: {
  evidenceId: string;
  caseId: string;
  reason: string;
  user?: string;
}): Promise<void> {
  const response = await fetch(
    `${API_URL}/evidence/${params.evidenceId}/exclude`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId: params.caseId,
        reason: params.reason,
        user: params.user || "Investigator",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to exclude evidence: ${errorText}`
    );
  }
}

export async function restoreEvidence(params: {
  evidenceId: string;
  caseId: string;
  reason?: string;
  user?: string;
}): Promise<void> {
  const response = await fetch(
    `${API_URL}/evidence/${params.evidenceId}/restore`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        caseId: params.caseId,
        reason: params.reason || "Evidence restored",
        user: params.user || "Investigator",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Failed to restore evidence: ${errorText}`
    );
  }
}