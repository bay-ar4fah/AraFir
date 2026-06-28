import type { Permission, UserRole } from "../types/auth";

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "case:create",
    "case:read",
    "case:update",
    "case:assign",
    "case:delete",
    "evidence:create",
    "evidence:read",
    "evidence:update",
    "evidence:exclude",
    "evidence:restore",
    "evidence:delete",
    "finding:read",
    "finding:create",
    "finding:update",
    "finding:delete",
    "report:export",
    "audit:read",
    "user:manage",
  ],

  DFIR_MANAGER: [
    "case:create",
    "case:read",
    "case:update",
    "case:assign",
    "evidence:create",
    "evidence:read",
    "evidence:update",
    "evidence:exclude",
    "evidence:restore",
    "finding:read",
    "finding:create",
    "finding:update",
    "finding:delete",
    "report:export",
    "audit:read",
  ],

  INVESTIGATOR: [
    "case:create",
    "case:read",
    "evidence:create",
    "evidence:read",
    "evidence:update",
    "evidence:exclude",
    "evidence:restore",
    "finding:read",
    "finding:create",
    "finding:update",
    "report:export",
  ],

  ANALYST: [
    "case:read",
    "evidence:read",
    "finding:read",
    "finding:create",
    "finding:update",
    "report:export",
  ],

  AUDITOR: [
    "case:read",
    "evidence:read",
    "finding:read",
    "report:export",
    "audit:read",
  ],

  READ_ONLY: [
    "case:read",
    "evidence:read",
    "finding:read",
  ],
};