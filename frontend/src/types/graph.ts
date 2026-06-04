export interface AttackNode {
  id: string;
  label: string;
  type: string;
}

export interface AttackEdge {
  id: string;
  source: string;
  target: string;
}