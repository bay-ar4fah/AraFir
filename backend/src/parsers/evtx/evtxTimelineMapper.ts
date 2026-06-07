import crypto from "crypto";

import type {
  TimelineEvent,
} from "../../types/timeline";

import type {
  ParsedEvtxEvent,
} from "./evtxTypes";

import {
  mapEvtxSeverity,
} from "./evtxSeverity";

import {
  mapEvtxEventType,
} from "./evtxEventType";

export function mapEvtxToTimelineEvents(params: {
  parsedEvents: ParsedEvtxEvent[];
  caseId: string;
  evidenceId: string;
  filename: string;
}): TimelineEvent[] {
  return params.parsedEvents.map((event) => {
    const eventType =
      mapEvtxEventType(
        event.eventId,
        event.message
      );

    const severity =
      mapEvtxSeverity(
        event.eventId,
        event.message
      );

    return {
      id: crypto.randomUUID(),
      caseId: params.caseId,
      evidenceId: params.evidenceId,
      timestamp:
        event.timestamp ||
        new Date().toISOString(),
      source: params.filename,
      eventType,
      description:
        `Event ID ${event.eventId} from ${event.provider}`,
      severity,
      rawData: JSON.stringify({
        eventId: event.eventId,
        provider: event.provider,
        computer: event.computer,
        level: event.level,
        recordId: event.recordId,
        message: event.message,
        rawXml: event.rawXml,
      }),
    };
  });
}