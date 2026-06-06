import type { Case } from "../types/case";

const API_URL = "http://localhost:3001/api";

export async function getCases(): Promise<Case[]> {
  const response = await fetch(`${API_URL}/cases`);

  if (!response.ok) {
    throw new Error("Failed to fetch cases");
  }

  return response.json();
}

export async function createCase(
  forensicCase: Case
): Promise<void> {
  const response = await fetch(`${API_URL}/cases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(forensicCase),
  });

  if (!response.ok) {
    throw new Error("Failed to create case");
  }
}