import type {
  CreateMemoryArtifactPayload,
  MemoryArtifact,
  MemorySummary,
} from "../types/memory";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("arafir_token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const getMemorySummary = async (
  caseId: string | number
): Promise<MemorySummary> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/memory/summary`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch memory summary");
  }

  return response.json();
};

export const getMemoryArtifacts = async (
  caseId: string | number
): Promise<MemoryArtifact[]> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/memory/artifacts`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch memory artifacts");
  }

  return response.json();
};

export const getMemoryProcesses = async (
  caseId: string | number
): Promise<MemoryArtifact[]> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/memory/processes`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch memory processes");
  }

  return response.json();
};

export const getMemoryNetwork = async (
  caseId: string | number
): Promise<MemoryArtifact[]> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/memory/network`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch memory network");
  }

  return response.json();
};

export const createMemoryArtifact = async (
  caseId: string | number,
  payload: CreateMemoryArtifactPayload
): Promise<MemoryArtifact> => {
  const response = await fetch(`${API_BASE_URL}/cases/${caseId}/memory/artifacts`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create memory artifact");
  }

  return response.json();
};

export const reviewMemoryArtifact = async (
  caseId: string | number,
  artifactId: number
): Promise<MemoryArtifact> => {
  const response = await fetch(
    `${API_BASE_URL}/cases/${caseId}/memory/artifacts/${artifactId}/review`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to review memory artifact");
  }

  return response.json();
};

export const markMemoryArtifactFalsePositive = async (
  caseId: string | number,
  artifactId: number
): Promise<MemoryArtifact> => {
  const response = await fetch(
    `${API_BASE_URL}/cases/${caseId}/memory/artifacts/${artifactId}/false-positive`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to mark memory artifact as false positive");
  }

  return response.json();
};