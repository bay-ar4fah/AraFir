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
  | "case:assign"
  | "case:update"
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
  | "attribution:read"
  | "attribution:update"
  | "attribution:review"
  | "lessons:read"
  | "lessons:update"
  | "lessons:review"
  | "report:export"
  | "audit:read"
  | "user:manage";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel?: string;
  permissions: Permission[];
  mustChangePassword?: boolean;
}