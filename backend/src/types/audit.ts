export type AuditStatus =
  | "SUCCESS"
  | "FAILED";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "CASE_CREATED"
  | "CASE_UPDATED"
  | "CASE_DELETED"
  | "CASE_REASSIGNED"
  | "EVIDENCE_UPLOADED"
  | "EVIDENCE_EXCLUDED"
  | "EVIDENCE_RESTORED"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DEACTIVATED"
  | "USER_ACTIVATED"
  | "PASSWORD_CHANGED"
  | "FINDING_CREATED"
  | "FINDING_UPDATED"
  | "FINDING_DELETED"
  | "ATTRIBUTION_UPDATED"
  | "ATTRIBUTION_HYPOTHESIS_CREATED"
  | "ATTRIBUTION_HYPOTHESIS_UPDATED"
  | "ATTRIBUTION_EVIDENCE_MATRIX_CREATED"
  | "LESSONS_UPDATED"
  | "CAPA_CREATED"
  | "CAPA_UPDATED";

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
