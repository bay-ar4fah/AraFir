export interface Evidence {
  id: string;
  caseId: string;
  filename: string;
  fileType: string;
  size: number;
  sha256: string;
  importedAt: string;
  importedBy: string;
  status?: "ACTIVE" | "EXCLUDED";
  excludedAt?: string;
  excludedBy?: string;
  excludeReason?: string;
}