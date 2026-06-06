import type {
  SystemStatus,
} from "../types/status";

const API_URL = "http://localhost:3001/api";

export async function getSystemStatus(): Promise<SystemStatus> {
  const response = await fetch(`${API_URL}/status`);

  if (!response.ok) {
    throw new Error("Failed to fetch system status");
  }

  return response.json();
}