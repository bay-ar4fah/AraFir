import type { UserRole } from "./auth";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}