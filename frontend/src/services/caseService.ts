import { getAuthHeaders } from "./authService";

const API_URL = "http://localhost:3001/api";

export async function getCases() {
  const response = await fetch(`${API_URL}/cases`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load cases");
  }

  return response.json();
}

export async function getCaseById(caseId: string) {
  const response = await fetch(`${API_URL}/cases/${caseId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load case");
  }

  return response.json();
}

export async function createCase(params: {
  caseName: string;
  description: string;
  investigator: string;
}) {
  const response = await fetch(`${API_URL}/cases`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    console.error("Create case failed:", {
      status: response.status,
      error,
    });

    throw new Error(
      error?.message ||
      error?.error ||
      "Failed to create case"
    );
  }

  return response.json();
}
export async function deleteCaseById(
  caseId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/cases/${caseId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.error ||
      error?.message ||
      "Failed to delete case"
    );
  }
}