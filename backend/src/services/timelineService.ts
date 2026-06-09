import { db } from "../database/db";
import type { TimelineEvent } from "../types/timeline";

export function createTimelineEvent(
  event: TimelineEvent
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO timeline_events (
        id,
        caseId,
        evidenceId,
        timestamp,
        source,
        eventType,
        description,
        severity,
        rawData
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        event.id,
        event.caseId,
        event.evidenceId,
        event.timestamp,
        event.source,
        event.eventType,
        event.description,
        event.severity,
        event.rawData,
      ],
      (err: Error | null) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

export function getTimelineByCaseId(
  caseId: string
): Promise<TimelineEvent[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT timeline_events.*
      FROM timeline_events
      LEFT JOIN evidence
        ON evidence.id = timeline_events.evidenceId
      WHERE timeline_events.caseId = ?
        AND COALESCE(evidence.status, 'ACTIVE') = 'ACTIVE'
      ORDER BY timeline_events.timestamp DESC
      `,
      [caseId],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);

        resolve(rows as TimelineEvent[]);
      }
    );
  });
}

export function getAllTimelineEvents(): Promise<TimelineEvent[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT timeline_events.*
      FROM timeline_events
      LEFT JOIN evidence
        ON evidence.id = timeline_events.evidenceId
      WHERE COALESCE(evidence.status, 'ACTIVE') = 'ACTIVE'
      ORDER BY timeline_events.timestamp DESC
      `,
      [],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);

        resolve(rows as TimelineEvent[]);
      }
    );
  });
}