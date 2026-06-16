import { getAuthToken } from "./authService";

const API_URL = "http://localhost:3001/api";

export async function uploadArtifact(
  caseId: string,
  file: File
) {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/cases/${caseId}/artifacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload artifact");
  }

  return response.json();
}