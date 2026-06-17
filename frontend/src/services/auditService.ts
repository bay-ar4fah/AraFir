import { getAuthHeaders } from "./authService";
import type { AuditLog } from "../types/audit";

const API_BASE_URL = "http://localhost:3001/api";

export async function getAuditLogs(): Promise<AuditLog[]> {
  const response = await fetch(
    `${API_BASE_URL}/audit-logs`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load audit logs");
  }

  return response.json();
}