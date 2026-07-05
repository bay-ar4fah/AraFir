import { db } from "../database/db";

import {
  CreateMemoryArtifactRequest,
  MemoryArtifact,
  MemoryArtifactStatus,
  MemorySummary,
} from "../types/memory";

interface SqliteRunResult {
  lastID?: number;
  changes?: number;
}

interface SqliteDatabase {
  all(
    sql: string,
    params: unknown[],
    callback: (error: Error | null, rows: MemoryArtifactRow[]) => void
  ): void;

  get(
    sql: string,
    params: unknown[],
    callback: (error: Error | null, row: MemoryArtifactRow | undefined) => void
  ): void;

  run(
    sql: string,
    params: unknown[],
    callback: (this: SqliteRunResult, error: Error | null) => void
  ): void;
}

interface MemoryArtifactRow {
  id: number;
  case_id: number;
  evidence_id?: number | null;
  artifact_type: MemoryArtifact["artifactType"];
  name: string;
  description?: string | null;
  process_name?: string | null;
  pid?: number | null;
  ppid?: number | null;
  command_line?: string | null;
  source_ip?: string | null;
  source_port?: number | null;
  destination_ip?: string | null;
  destination_port?: number | null;
  protocol?: string | null;
  severity: MemoryArtifact["severity"];
  confidence: number;
  mitre_technique?: string | null;
  source_tool?: string | null;
  raw_json?: string | null;
  status: MemoryArtifact["status"];
  created_by?: string | null;
  created_at: string;
  updated_at?: string | null;

  totalArtifacts?: number;
  processCount?: number;
  networkCount?: number;
  suspiciousCount?: number;
  criticalCount?: number;
  promotedFindings?: number;
}

const sqliteDb = db as unknown as SqliteDatabase;

const dbAll = <T = MemoryArtifactRow>(
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

const dbGet = <T = MemoryArtifactRow>(
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

const mapRowToMemoryArtifact = (
  row: MemoryArtifactRow
): MemoryArtifact => ({
  id: row.id,
  caseId: row.case_id,
  evidenceId: row.evidence_id ?? null,
  artifactType: row.artifact_type,
  name: row.name,
  description: row.description ?? null,
  processName: row.process_name ?? null,
  pid: row.pid ?? null,
  ppid: row.ppid ?? null,
  commandLine: row.command_line ?? null,
  sourceIp: row.source_ip ?? null,
  sourcePort: row.source_port ?? null,
  destinationIp: row.destination_ip ?? null,
  destinationPort: row.destination_port ?? null,
  protocol: row.protocol ?? null,
  severity: row.severity,
  confidence: row.confidence,
  mitreTechnique: row.mitre_technique ?? null,
  sourceTool: row.source_tool ?? null,
  rawJson: row.raw_json ?? null,
  status: row.status,
  createdBy: row.created_by ?? null,
  createdAt: row.created_at,
  updatedAt: row.updated_at ?? null,
});

export const getMemorySummary = async (
  caseId: number
): Promise<MemorySummary> => {
  const row = await dbGet<MemoryArtifactRow>(
    `
      SELECT
        COUNT(*) AS totalArtifacts,
        SUM(CASE WHEN artifact_type = 'PROCESS' THEN 1 ELSE 0 END) AS processCount,
        SUM(CASE WHEN artifact_type = 'NETWORK_CONNECTION' THEN 1 ELSE 0 END) AS networkCount,
        SUM(CASE WHEN severity IN ('HIGH', 'CRITICAL') THEN 1 ELSE 0 END) AS suspiciousCount,
        SUM(CASE WHEN severity = 'CRITICAL' THEN 1 ELSE 0 END) AS criticalCount,
        SUM(CASE WHEN status = 'PROMOTED_TO_FINDING' THEN 1 ELSE 0 END) AS promotedFindings
      FROM memory_artifacts
      WHERE case_id = ?
    `,
    [caseId]
  );

  return {
    totalArtifacts: row?.totalArtifacts ?? 0,
    processCount: row?.processCount ?? 0,
    networkCount: row?.networkCount ?? 0,
    suspiciousCount: row?.suspiciousCount ?? 0,
    criticalCount: row?.criticalCount ?? 0,
    promotedFindings: row?.promotedFindings ?? 0,
  };
};

export const getMemoryArtifactsByCase = async (
  caseId: number
): Promise<MemoryArtifact[]> => {
  const rows = await dbAll<MemoryArtifactRow>(
    `
      SELECT *
      FROM memory_artifacts
      WHERE case_id = ?
      ORDER BY
        CASE severity
          WHEN 'CRITICAL' THEN 1
          WHEN 'HIGH' THEN 2
          WHEN 'MEDIUM' THEN 3
          ELSE 4
        END,
        created_at DESC
    `,
    [caseId]
  );

  return rows.map(mapRowToMemoryArtifact);
};

export const getMemoryProcessesByCase = async (
  caseId: number
): Promise<MemoryArtifact[]> => {
  const rows = await dbAll<MemoryArtifactRow>(
    `
      SELECT *
      FROM memory_artifacts
      WHERE case_id = ?
        AND artifact_type = 'PROCESS'
      ORDER BY pid ASC
    `,
    [caseId]
  );

  return rows.map(mapRowToMemoryArtifact);
};

export const getMemoryNetworkByCase = async (
  caseId: number
): Promise<MemoryArtifact[]> => {
  const rows = await dbAll<MemoryArtifactRow>(
    `
      SELECT *
      FROM memory_artifacts
      WHERE case_id = ?
        AND artifact_type = 'NETWORK_CONNECTION'
      ORDER BY created_at DESC
    `,
    [caseId]
  );

  return rows.map(mapRowToMemoryArtifact);
};

export const createMemoryArtifact = async (
  caseId: number,
  payload: CreateMemoryArtifactRequest,
  createdBy?: string
): Promise<MemoryArtifact> => {
  const result = await dbRun(
    `
      INSERT INTO memory_artifacts (
        case_id,
        evidence_id,
        artifact_type,
        name,
        description,
        process_name,
        pid,
        ppid,
        command_line,
        source_ip,
        source_port,
        destination_ip,
        destination_port,
        protocol,
        severity,
        confidence,
        mitre_technique,
        source_tool,
        raw_json,
        status,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', ?)
    `,
    [
      caseId,
      payload.evidenceId ?? null,
      payload.artifactType,
      payload.name,
      payload.description ?? null,
      payload.processName ?? null,
      payload.pid ?? null,
      payload.ppid ?? null,
      payload.commandLine ?? null,
      payload.sourceIp ?? null,
      payload.sourcePort ?? null,
      payload.destinationIp ?? null,
      payload.destinationPort ?? null,
      payload.protocol ?? null,
      payload.severity ?? "LOW",
      payload.confidence ?? 50,
      payload.mitreTechnique ?? null,
      payload.sourceTool ?? null,
      payload.rawJson ?? null,
      createdBy ?? null,
    ]
  );

  if (!result.lastID) {
    throw new Error("Failed to create memory artifact");
  }

  const row = await dbGet<MemoryArtifactRow>(
    `
      SELECT *
      FROM memory_artifacts
      WHERE id = ?
    `,
    [result.lastID]
  );

  if (!row) {
    throw new Error("Memory artifact was created but could not be loaded");
  }

  return mapRowToMemoryArtifact(row);
};

export const updateMemoryArtifactStatus = async (
  caseId: number,
  artifactId: number,
  status: MemoryArtifactStatus
): Promise<MemoryArtifact | null> => {
  await dbRun(
    `
      UPDATE memory_artifacts
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
        AND case_id = ?
    `,
    [status, artifactId, caseId]
  );

  const row = await dbGet<MemoryArtifactRow>(
    `
      SELECT *
      FROM memory_artifacts
      WHERE id = ?
        AND case_id = ?
    `,
    [artifactId, caseId]
  );

  if (!row) {
    return null;
  }

  return mapRowToMemoryArtifact(row);
};