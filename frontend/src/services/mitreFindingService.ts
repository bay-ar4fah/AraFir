import type {
  MitreFinding,
} from "../types/mitreFinding";

const API_URL = "http://localhost:3001/api";

export async function getMitreFindingsByCaseId(
  caseId: string
): Promise<MitreFinding[]> {
  const response = await fetch(
    `${API_URL}/cases/${caseId}/mitre`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch MITRE findings");
  }

  return response.json();
}