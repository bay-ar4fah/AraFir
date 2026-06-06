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