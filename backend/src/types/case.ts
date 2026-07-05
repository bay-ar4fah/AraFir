export interface Case {
  id: string;
  caseName: string;
  description: string;
  createdAt: string;
  investigator: string;
  investigatorId?: string;
  investigatorName?: string;
  assignedByUserId?: string;
  assignedByName?: string;
  assignedAt?: string;
  status: string;
  investigationType: InvestigationType;
  priority: CasePriority;
  classification: CaseClassification;
  expectedEvidence: string | null;
  caseTags: string | null;
}

export type InvestigationType =
  | "WINDOWS_ENDPOINT"
  | "LINUX_SERVER"
  | "MEMORY_FORENSICS"
  | "NETWORK_FORENSICS"
  | "MOBILE_FORENSICS"
  | "CLOUD_FORENSICS"
  | "EMAIL_INVESTIGATION"
  | "MALWARE_ANALYSIS"
  | "RANSOMWARE"
  | "INSIDER_THREAT"
  | "MULTI_SOURCE";

export type CasePriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type CaseClassification =
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "RESTRICTED"
  | "LEGAL_HOLD";