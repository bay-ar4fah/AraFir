import type {
  AttackStory,
} from "../types/attackStory";

const API_URL = "http://localhost:3001/api";

export async function getAttackStoryByCaseId(
  caseId: string
): Promise<AttackStory> {
  const response = await fetch(
    `${API_URL}/cases/${caseId}/attack-story`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch attack story");
  }

  return response.json();
}