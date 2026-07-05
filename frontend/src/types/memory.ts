export type MemoryArtifactType =
  | "PROCESS"
  | "NETWORK_CONNECTION"
  | "DLL_MODULE"
  | "COMMAND_LINE"
  | "INJECTION"
  | "MALWARE_INDICATOR"
  | "REGISTRY"
  | "HANDLE"
  | "YARA_MATCH"
  | "OTHER";

export type MemorySeverity =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type MemoryArtifactStatus =
  | "NEW"
  | "REVIEWED"
  | "PROMOTED_TO_FINDING"
  | "FALSE_POSITIVE";

export interface MemoryArtifact {
  id: number;
  caseId: number;
  evidenceId?: number | null;
  artifactType: MemoryArtifactType;
  name: string;
  description?: string | null;
  processName?: string | null;
  pid?: number | null;
  ppid?: number | null;
  commandLine?: string | null;
  sourceIp?: string | null;
  sourcePort?: number | null;
  destinationIp?: string | null;
  destinationPort?: number | null;
  protocol?: string | null;
  severity: MemorySeverity;
  confidence: number;
  mitreTechnique?: string | null;
  sourceTool?: string | null;
  rawJson?: string | null;
  status: MemoryArtifactStatus;
  createdBy?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface MemorySummary {
  totalArtifacts: number;
  processCount: number;
  networkCount: number;
  suspiciousCount: number;
  criticalCount: number;
  promotedFindings: number;
}

export interface CreateMemoryArtifactPayload {
  evidenceId?: number | null;
  artifactType: MemoryArtifactType;
  name: string;
  description?: string;
  processName?: string;
  pid?: number;
  ppid?: number;
  commandLine?: string;
  sourceIp?: string;
  sourcePort?: number;
  destinationIp?: string;
  destinationPort?: number;
  protocol?: string;
  severity?: MemorySeverity;
  confidence?: number;
  mitreTechnique?: string;
  sourceTool?: string;
  rawJson?: string;
}