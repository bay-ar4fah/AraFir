import {
  getAuthHeaders,
} from "./authService";

import type {
  InvestigationDashboard,
} from "../types/dashboard";

const API_URL =
  "http://localhost:3001/api";

export async function getInvestigationDashboard():
  Promise<InvestigationDashboard> {
  const response = await fetch(
    `${API_URL}/dashboard/investigation`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    const error =
      await response.json().catch(() => null);

    throw new Error(
      error?.error ||
        error?.message ||
        "Failed to load investigation dashboard"
    );
  }

  return response.json();
}