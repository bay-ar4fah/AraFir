import { getAuthHeaders } from "./authService";
import type {
  AppUser,
  CreateUserPayload,
} from "../types/user";
import type { UserRole } from "../types/auth";

const API_BASE_URL = "http://localhost:3001/api";

export async function getUsers(): Promise<AppUser[]> {
  const response = await fetch(
    `${API_BASE_URL}/users`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load users");
  }

  return response.json();
}

export async function createUser(
  payload: CreateUserPayload
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/users`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create user");
  }
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/role`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ role }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update user role");
  }
}

export async function disableUser(
  userId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/disable`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to disable user");
  }
}

export async function enableUser(
  userId: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/enable`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to enable user");
  }
}

export async function resetUserPassword(
  userId: string,
  password: string
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/users/${userId}/reset-password`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reset password");
  }
}

export async function getCaseAssignableUsers(): Promise<AppUser[]> {
  const response = await fetch(
    `${API_BASE_URL}/users/case-assignable`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load assignable users");
  }

  return response.json();
}