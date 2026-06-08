import type {
  CustodyLog,
} from "../types/custody";

const API_URL = "http://localhost:3001/api";

export async function getCustodyLogsByCaseId(
  caseId: string
): Promise<CustodyLog[]> {
  const response = await fetch(
    `${API_URL}/cases/${caseId}/custody`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch custody logs");
  }

  return response.json();
}