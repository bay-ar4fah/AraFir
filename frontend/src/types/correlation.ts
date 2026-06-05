export interface AttackChainNode {
  techniqueId: string;
  techniqueName: string;
  tactic: string;
}

export interface AttackChain {
  id: string;
  confidence: number;
  chain: AttackChainNode[];
}