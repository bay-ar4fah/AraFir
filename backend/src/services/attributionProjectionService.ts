import { db } from "../database/db";

import type {
  CaseAttributionProjection,
  CaseCardAttributionProjection,
} from "../types/attributionProjection";

function dbGet<T>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

function dbAll<T>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

export async function getCaseAttributionProjection(
  caseId: string
): Promise<CaseAttributionProjection> {
  const row =
    await dbGet<CaseAttributionProjection>(
      `
      SELECT
        case_id as caseId,
        threat_actor as threatActor,
        campaign_name as campaignName,
        confidence,
        attribution_status as attributionStatus,
        initial_access as initialAccess,
        root_cause as rootCause,
        final_assessment as finalAssessment,
        recommended_remediation as recommendedRemediation,
        updated_at as updatedAt
      FROM attribution_assessments
      WHERE case_id = ?
      `,
      [caseId]
    );

  return (
    row ?? {
      caseId,
      threatActor: null,
      campaignName: null,
      confidence: null,
      attributionStatus: null,
      initialAccess: null,
      rootCause: null,
      finalAssessment: null,
      recommendedRemediation: null,
      updatedAt: null,
    }
  );
}

export async function getCaseCardsAttributionProjection():
  Promise<CaseCardAttributionProjection[]> {
  return dbAll<CaseCardAttributionProjection>(
    `
    SELECT
      case_id as caseId,
      threat_actor as threatActor,
      campaign_name as campaignName,
      confidence,
      attribution_status as attributionStatus
    FROM attribution_assessments
    `
  );
}