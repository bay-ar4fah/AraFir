export type AttackGraphNodeType =
  | "CASE"
  | "EVIDENCE"
  | "TIMELINE"
  | "MITRE"
  | "TACTIC";

export interface AttackGraphNodeData
  extends Record<string, unknown> {
  label: string;
  subtitle?: string;
  severity?: string;
  type: AttackGraphNodeType;
}

export interface AttackGraphEdgeData
  extends Record<string, unknown> {
  label: string;
}