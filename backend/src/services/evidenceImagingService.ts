import { db }
from "../database/db";

import {
  CreateEvidenceImagePayload,
  EvidenceImageRecord,
  EvidenceImagingStatus,
} from "../types/evidenceImaging";

interface SqliteRunResult {
  lastID?: number;
  changes?: number;
}

interface EvidenceImageRow {
  id: number;
  case_id: string;
  evidence_id?: string | null;
  source_device: string;
  source_type: string;
  image_format: EvidenceImageRecord["imageFormat"];
  image_path?: string | null;
  image_size_bytes?: number | null;
  acquisition_tool?: string | null;
  write_blocker_used: number;
  hash_md5?: string | null;
  hash_sha1?: string | null;
  hash_sha256?: string | null;
  verification_status: EvidenceImageRecord["verificationStatus"];
  acquired_by?: string | null;
  acquired_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
}

interface SqliteDatabase {
  all(
    sql: string,
    params: unknown[],
    callback: (error: Error | null, rows: EvidenceImageRow[]) => void
  ): void;

  get(
    sql: string,
    params: unknown[],
    callback: (error: Error | null, row: EvidenceImageRow | undefined) => void
  ): void;

  run(
    sql: string,
    params: unknown[],
    callback: (this: SqliteRunResult, error: Error | null) => void
  ): void;
}

const sqliteDb = db as unknown as SqliteDatabase;

const dbAll = <T = EvidenceImageRow>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows as T[]);
    });
  });
};

const dbGet = <T = EvidenceImageRow>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    sqliteDb.get(sql, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(row as T | undefined);
    });
  });
};

const dbRun = (
  sql: string,
  params: unknown[] = []
): Promise<SqliteRunResult> => {
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (
      this: SqliteRunResult,
      error: Error | null
    ) {
      if (error) {
        reject(error);
        return;
      }

      resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
};

const mapRow = (row: EvidenceImageRow): EvidenceImageRecord => ({
  id: row.id,
  caseId: row.case_id,
  evidenceId: row.evidence_id ?? null,
  sourceDevice: row.source_device,
  sourceType: row.source_type,
  imageFormat: row.image_format,
  imagePath: row.image_path ?? null,
  imageSizeBytes: row.image_size_bytes ?? null,
  acquisitionTool: row.acquisition_tool ?? null,
  writeBlockerUsed: row.write_blocker_used === 1,
  hashMd5: row.hash_md5 ?? null,
  hashSha1: row.hash_sha1 ?? null,
  hashSha256: row.hash_sha256 ?? null,
  verificationStatus: row.verification_status,
  acquiredBy: row.acquired_by ?? null,
  acquiredAt: row.acquired_at ?? null,
  notes: row.notes ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at ?? null,
});

export const listEvidenceImagesByCase = async (
  caseId: string
): Promise<EvidenceImageRecord[]> => {
  const rows = await dbAll<EvidenceImageRow>(
    `
      SELECT *
      FROM evidence_images
      WHERE case_id = ?
      ORDER BY created_at DESC
    `,
    [caseId]
  );

  return rows.map(mapRow);
};

export const createEvidenceImage = async (
  caseId: string,
  payload: CreateEvidenceImagePayload,
  acquiredBy?: string
): Promise<EvidenceImageRecord> => {
  const result = await dbRun(
    `
      INSERT INTO evidence_images (
        case_id,
        evidence_id,
        source_device,
        source_type,
        image_format,
        image_path,
        image_size_bytes,
        acquisition_tool,
        write_blocker_used,
        hash_md5,
        hash_sha1,
        hash_sha256,
        verification_status,
        acquired_by,
        acquired_at,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      caseId,
      payload.evidenceId ?? null,
      payload.sourceDevice,
      payload.sourceType,
      payload.imageFormat,
      payload.imagePath ?? null,
      payload.imageSizeBytes ?? null,
      payload.acquisitionTool ?? null,
      payload.writeBlockerUsed ? 1 : 0,
      payload.hashMd5 ?? null,
      payload.hashSha1 ?? null,
      payload.hashSha256 ?? null,
      payload.verificationStatus ?? "PLANNED",
      acquiredBy ?? null,
      payload.acquiredAt ?? null,
      payload.notes ?? null,
    ]
  );

  if (!result.lastID) {
    throw new Error("Failed to create evidence image record");
  }

  const row = await dbGet<EvidenceImageRow>(
    `
      SELECT *
      FROM evidence_images
      WHERE id = ?
    `,
    [result.lastID]
  );

  if (!row) {
    throw new Error("Evidence image record could not be loaded");
  }

  return mapRow(row);
};

export const updateEvidenceImageStatus = async (
  caseId: string,
  imageId: number,
  status: EvidenceImagingStatus
): Promise<EvidenceImageRecord | null> => {
  await dbRun(
    `
      UPDATE evidence_images
      SET verification_status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND case_id = ?
    `,
    [status, imageId, caseId]
  );

  const row = await dbGet<EvidenceImageRow>(
    `
      SELECT *
      FROM evidence_images
      WHERE id = ?
        AND case_id = ?
    `,
    [imageId, caseId]
  );

  return row ? mapRow(row) : null;
};