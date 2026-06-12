export type AuditStatus =
  | "SUCCESS"
  | "FAILED";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "USER_CREATED"
  | "USER_ROLE_UPDATED"
  | "USER_DISABLED"
  | "USER_ENABLED"
  | "USER_PASSWORD_RESET"
  | "PASSWORD_CHANGED"
  | "CASE_CREATED"
  | "EVIDENCE_UPLOADED"
  | "EVIDENCE_EXCLUDED"
  | "EVIDENCE_RESTORED"
  | "REPORT_EXPORTED";

export interface CreateAuditLogParams {
  actorUserId?: string | null;
  actorName?: string | null;
  actorEmail?: string | null;
  actorRole?: string | null;
  action: AuditAction;
  entityType?: string | null;
  entityId?: string | null;
  entityName?: string | null;
  caseId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | string[] | null;
  status?: AuditStatus;
  message?: string | null;
  metadata?: Record<string, unknown> | null;
}