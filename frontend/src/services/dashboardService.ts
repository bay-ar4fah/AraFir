import {
  getAuthHeaders,
} from "./authService";

import type {
  InvestigationDashboard,
} from "../types/dashboard";

const API_URL =
  "http://localhost:3001/api";

function buildNoCacheUrl(path: string): string {
  const url = new URL(`${API_URL}${path}`);

  url.searchParams.set(
    "_ts",
    Date.now().toString()
  );

  return url.toString();
}

async function parseErrorMessage(
  response: Response
): Promise<string> {
  const error =
    await response.json().catch(() => null);

  return (
    error?.error ||
    error?.message ||
    `Request failed with status ${response.status}`
  );
}

export async function getInvestigationDashboard():
  Promise<InvestigationDashboard> {
  const headers =
    new Headers(getAuthHeaders());

  headers.set(
    "Cache-Control",
    "no-cache"
  );

  headers.set(
    "Pragma",
    "no-cache"
  );

  const response = await fetch(
    buildNoCacheUrl("/dashboard/investigation"),
    {
      method: "GET",
      headers,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const message =
      await parseErrorMessage(response);

    throw new Error(
      message ||
        "Failed to load investigation dashboard"
    );
  }

  return response.json();
}