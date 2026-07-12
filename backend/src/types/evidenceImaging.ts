export type EvidenceImageFormat =
  | "RAW"
  | "DD"
  | "E01"
  | "AFF4"
  | "OTHER";

export type EvidenceImagingStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "VERIFIED"
  | "FAILED";

export interface EvidenceImageRecord {
  id: number;
  caseId: string;
  evidenceId?: string | null;
  sourceDevice: string;
  sourceType: string;
  imageFormat: EvidenceImageFormat;
  imagePath?: string | null;
  imageSizeBytes?: number | null;
  acquisitionTool?: string | null;
  writeBlockerUsed: boolean;
  hashMd5?: string | null;
  hashSha1?: string | null;
  hashSha256?: string | null;
  verificationStatus: EvidenceImagingStatus;
  acquiredBy?: string | null;
  acquiredAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateEvidenceImagePayload {
  evidenceId?: string | null;
  sourceDevice: string;
  sourceType: string;
  imageFormat: EvidenceImageFormat;
  imagePath?: string;
  imageSizeBytes?: number;
  acquisitionTool?: string;
  writeBlockerUsed?: boolean;
  hashMd5?: string;
  hashSha1?: string;
  hashSha256?: string;
  verificationStatus?: EvidenceImagingStatus;
  acquiredAt?: string;
  notes?: string;
}