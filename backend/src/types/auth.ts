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
  | "case:assign"
  | "case:delete"
  | "evidence:create"
  | "evidence:read"
  | "evidence:update"
  | "evidence:exclude"
  | "evidence:restore"
  | "evidence:delete"
  | "finding:read"
  | "finding:create"
  | "finding:update"
  | "finding:delete"
  | "report:export"
  | "attribution:read"
  | "attribution:update"
  | "attribution:review"
  | "lessons:read"
  | "lessons:update"
  | "lessons:review"
  | "audit:read"
  | "user:manage";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel?: string;
  mustChangePassword?: boolean;
}