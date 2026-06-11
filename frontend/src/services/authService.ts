import type { AuthUser } from "../types/auth";

const API_BASE_URL = "http://localhost:3001/api";

export async function loginRequest(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid email or password");
  }

  return res.json();
}

export function getAuthToken() {
  return localStorage.getItem("arafir_token");
}

export function getAuthHeaders() {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function changePasswordRequest(params: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/auth/change-password`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => null);

    throw new Error(
      data?.details?.join(", ") ||
      data?.error ||
      "Failed to change password"
    );
  }
}