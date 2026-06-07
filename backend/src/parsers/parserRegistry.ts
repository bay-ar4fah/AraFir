import path from "path";
import type { TimelineEvent } from "../types/timeline";

export async function parseArtifact(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  const ext = path
    .extname(params.filename)
    .toLowerCase();

  if (ext === ".json") {
    return parseJsonArtifact(params);
  }

  if (ext === ".csv") {
    return parseCsvArtifact(params);
  }

  if (ext === ".evtx") {
    return parseEvtxPlaceholder(params);
  }

  return [
    {
      id: crypto.randomUUID(),
      caseId: params.caseId,
      evidenceId: params.evidenceId,
      timestamp: new Date().toISOString(),
      source: params.filename,
      eventType: "FILE_IMPORTED",
      description: `Evidence file imported: ${params.filename}`,
      severity: "LOW",
      rawData: JSON.stringify({
        filename: params.filename,
        parser: "generic",
      }),
    },
  ];
}

async function parseJsonArtifact(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  return [
    {
      id: crypto.randomUUID(),
      caseId: params.caseId,
      evidenceId: params.evidenceId,
      timestamp: new Date().toISOString(),
      source: params.filename,
      eventType: "JSON_ARTIFACT_IMPORTED",
      description: `JSON artifact imported: ${params.filename}`,
      severity: "LOW",
      rawData: JSON.stringify({
        parser: "json",
        filePath: params.filePath,
      }),
    },
  ];
}

async function parseCsvArtifact(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  return [
    {
      id: crypto.randomUUID(),
      caseId: params.caseId,
      evidenceId: params.evidenceId,
      timestamp: new Date().toISOString(),
      source: params.filename,
      eventType: "CSV_ARTIFACT_IMPORTED",
      description: `CSV artifact imported: ${params.filename}`,
      severity: "LOW",
      rawData: JSON.stringify({
        parser: "csv",
        filePath: params.filePath,
      }),
    },
  ];
}

async function parseEvtxPlaceholder(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  return [
    {
      id: crypto.randomUUID(),
      caseId: params.caseId,
      evidenceId: params.evidenceId,
      timestamp: new Date().toISOString(),
      source: params.filename,
      eventType: "EVTX_ARTIFACT_IMPORTED",
      description: `EVTX artifact queued for parsing: ${params.filename}`,
      severity: "MEDIUM",
      rawData: JSON.stringify({
        parser: "evtx-placeholder",
        filePath: params.filePath,
      }),
    },
  ];
}