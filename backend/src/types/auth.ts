export type UserRole =
  | "SUPER_ADMIN"
  | "DFIR_MANAGER"
  | "INVESTIGATOR"
  | "ANALYST"
  | "AUDITOR"
  | "READ_ONLY";

export type Permission =
  | "case:create"
  | "case:read"
  | "case:update"
  | "case:delete"
  | "evidence:create"
  | "evidence:read"
  | "evidence:update"
  | "evidence:exclude"
  | "evidence:restore"
  | "evidence:delete"
  | "report:export"
  | "audit:read"
  | "user:manage";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword?: boolean;
}