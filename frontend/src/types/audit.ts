export interface AuditLog {
  id: string;
  actor_user_id: string | null;
  actor_name: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  entity_name: string | null;
  case_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  status: "SUCCESS" | "FAILED";
  message: string | null;
  metadata: string | null;
  created_at: string;
}