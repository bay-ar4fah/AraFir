import {
  getAuthHeaders,
} from "./authService";

import type {
  CreateEvidenceImagePayload,
  EvidenceImageRecord,
  EvidenceImagingStatus,
} from "../types/evidenceImaging";

const API_URL =
  "http://localhost:3001/api";

const buildUrl = (path: string) => {
  const url = new URL(`${API_URL}${path}`);

  url.searchParams.set(
    "_ts",
    Date.now().toString()
  );

  return url.toString();
};

export async function getEvidenceImages(
  caseId: string
): Promise<EvidenceImageRecord[]> {
  const response = await fetch(
    buildUrl(`/cases/${caseId}/evidence-imaging`),
    {
      headers: getAuthHeaders(),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load evidence imaging records");
  }

  return response.json();
}

export async function createEvidenceImageRecord(
  caseId: string,
  payload: CreateEvidenceImagePayload
): Promise<EvidenceImageRecord> {
  const response = await fetch(
    buildUrl(`/cases/${caseId}/evidence-imaging`),
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create evidence imaging record");
  }

  return response.json();
}

export async function updateEvidenceImageRecordStatus(
  caseId: string,
  imageId: number,
  status: EvidenceImagingStatus
): Promise<EvidenceImageRecord> {
  const response = await fetch(
    buildUrl(`/cases/${caseId}/evidence-imaging/${imageId}/status`),
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update evidence imaging status");
  }

  return response.json();
}