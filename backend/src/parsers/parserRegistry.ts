import path from "path";
import crypto from "crypto";

import type {
  TimelineEvent,
} from "../types/timeline";

import {
  parseEvtxFile,
} from "./evtx/evtxParser";

import {
  mapEvtxToTimelineEvents,
} from "./evtx/evtxTimelineMapper";

export async function parseArtifact(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  const ext = path
    .extname(params.filename)
    .toLowerCase();

  if (ext === ".evtx") {
    return parseEvtxArtifact(params);
  }

  if (ext === ".json") {
    return parseJsonArtifact(params);
  }

  if (ext === ".csv") {
    return parseCsvArtifact(params);
  }

  return createGenericImportEvent(params);
}

async function parseEvtxArtifact(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  try {
    const parsedEvents =
      await parseEvtxFile(params.filePath);

    if (parsedEvents.length === 0) {
      return createGenericImportEvent({
        ...params,
        eventType: "EVTX_EMPTY_OR_UNREADABLE",
        severity: "MEDIUM",
      });
    }

    return mapEvtxToTimelineEvents({
      parsedEvents,
      caseId: params.caseId,
      evidenceId: params.evidenceId,
      filename: params.filename,
    });
  } catch (err) {
    console.error("EVTX PARSE ERROR:", err);

    return createGenericImportEvent({
      ...params,
      eventType: "EVTX_PARSE_FAILED",
      severity: "HIGH",
    });
  }
}

async function parseJsonArtifact(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  return createGenericImportEvent({
    ...params,
    eventType: "JSON_ARTIFACT_IMPORTED",
    severity: "LOW",
  });
}

async function parseCsvArtifact(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
}): Promise<TimelineEvent[]> {
  return createGenericImportEvent({
    ...params,
    eventType: "CSV_ARTIFACT_IMPORTED",
    severity: "LOW",
  });
}

function createGenericImportEvent(params: {
  filePath: string;
  filename: string;
  caseId: string;
  evidenceId: string;
  eventType?: string;
  severity?: TimelineEvent["severity"];
}): TimelineEvent[] {
  return [
    {
      id: crypto.randomUUID(),
      caseId: params.caseId,
      evidenceId: params.evidenceId,
      timestamp: new Date().toISOString(),
      source: params.filename,
      eventType:
        params.eventType ||
        "FILE_IMPORTED",
      description:
        `Artifact processed: ${params.filename}`,
      severity:
        params.severity ||
        "LOW",
      rawData: JSON.stringify({
        filename: params.filename,
        filePath: params.filePath,
      }),
    },
  ];
}