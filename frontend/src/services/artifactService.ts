const API_URL = "http://localhost:3001/api";

export async function uploadArtifact(
  caseId: string,
  file: File
): Promise<void> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/cases/${caseId}/artifacts`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload artifact");
  }
}