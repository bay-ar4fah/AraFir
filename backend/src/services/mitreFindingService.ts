import crypto from "crypto";

import { db } from "../database/db";

import type {
  TimelineEvent,
} from "../types/timeline";

import type {
  MitreFinding,
} from "../types/mitre";

import {
  mitreRules,
} from "../mitre/mitreRules";

export function createMitreFinding(
  finding: MitreFinding
): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO mitre_findings (
        id,
        caseId,
        evidenceId,
        timelineEventId,
        tactic,
        techniqueId,
        techniqueName,
        severity,
        confidence,
        description,
        createdAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        finding.id,
        finding.caseId,
        finding.evidenceId,
        finding.timelineEventId,
        finding.tactic,
        finding.techniqueId,
        finding.techniqueName,
        finding.severity,
        finding.confidence,
        finding.description,
        finding.createdAt,
      ],
      (err: Error | null) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}

export async function generateMitreFindingsFromEvent(
  event: TimelineEvent
): Promise<MitreFinding[]> {
  const findings: MitreFinding[] = mitreRules
    .filter((rule) => rule.match(event))
    .map((rule) => ({
      id: crypto.randomUUID(),
      caseId: event.caseId,
      evidenceId: event.evidenceId,
      timelineEventId: event.id,
      tactic: rule.tactic,
      techniqueId: rule.techniqueId,
      techniqueName: rule.techniqueName,
      severity: rule.severity,
      confidence: rule.confidence,
      description: rule.description(event),
      createdAt: new Date().toISOString(),
    }));

  for (const finding of findings) {
    await createMitreFinding(finding);
  }

  return findings;
}

export function getMitreFindingsByCaseId(
  caseId: string
): Promise<MitreFinding[]> {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM mitre_findings
      WHERE caseId = ?
      ORDER BY createdAt DESC
      `,
      [caseId],
      (err: Error | null, rows: unknown[]) => {
        if (err) return reject(err);
        resolve(rows as MitreFinding[]);
      }
    );
  });
}