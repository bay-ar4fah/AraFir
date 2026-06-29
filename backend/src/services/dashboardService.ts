import { db } from "../database/db";
import type {
  InvestigationDashboard,
  DashboardCaseItem,
  DashboardFindingItem,
  DashboardTimelineItem,
  DashboardMitreHeatmapItem,
} from "../types/dashboard";

function dbGet<T>(
  sql: string,
  params: unknown[] = []
): Promise<T> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T);
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

export async function getInvestigationDashboard():
  Promise<InvestigationDashboard> {
  const openCases = await dbGet<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM cases
    WHERE status != 'CLOSED'
  `);

  const evidenceItems = await dbGet<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM evidence
  `);

  const activeFindings = await dbGet<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM mitre_findings
  `);

  const activeInvestigations =
    await dbAll<DashboardCaseItem>(`
      SELECT
        c.id,
        c.caseName,
        c.description,
        COALESCE(c.investigatorName, c.investigator) as investigator,
        c.status,
        (
          SELECT COUNT(*)
          FROM evidence e
          WHERE e.caseId = c.id
            AND COALESCE(e.status, 'ACTIVE') != 'EXCLUDED'
        ) as evidenceCount,
        (
          SELECT COUNT(*)
          FROM mitre_findings mf
          WHERE mf.caseId = c.id
        ) as findingCount,
        COALESCE(
          (
            SELECT MAX(al.created_at)
            FROM audit_logs al
            WHERE al.case_id = c.id
          ),
          c.createdAt
        ) as updatedAt
      FROM cases c
      ORDER BY updatedAt DESC
      LIMIT 6
    `);

  const recentFindings =
    await dbAll<DashboardFindingItem>(`
      SELECT
        mf.id,
        mf.caseId,
        c.caseName,
        COALESCE(
          mf.techniqueName,
          mf.techniqueId,
          mf.tactic,
          'Forensic Finding'
        ) as title,
        mf.severity,
        COALESCE(e.filename, 'Finding') as source,
        mf.createdAt
      FROM mitre_findings mf
      LEFT JOIN cases c ON c.id = mf.caseId
      LEFT JOIN evidence e ON e.id = mf.evidenceId
      ORDER BY mf.createdAt DESC
      LIMIT 8
    `);

  const attackTimeline =
    await dbAll<DashboardTimelineItem>(`
      SELECT
        te.id,
        te.caseId,
        c.caseName,
        te.timestamp as time,
        te.eventType,
        te.description,
        te.source,
        te.severity
      FROM timeline_events te
      LEFT JOIN cases c ON c.id = te.caseId
      ORDER BY te.timestamp DESC
      LIMIT 8
    `);

  const mitreHeatmap =
    await dbAll<DashboardMitreHeatmapItem>(`
      SELECT
        tactic,
        COUNT(*) as count
      FROM mitre_findings
      WHERE tactic IS NOT NULL
      GROUP BY tactic
      ORDER BY count DESC
      LIMIT 8
    `);

  const excludedEvidence = await dbGet<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM evidence
    WHERE status = 'EXCLUDED'
  `);

  const importedEvidence = evidenceItems.count;
  const analyzedEvidence =
    Math.max(0, importedEvidence - excludedEvidence.count);

  let attributionSummary = [
  {
    actor: "Unknown Actor",
    confidence: "LOW" as const,
    supportingFindings: activeFindings.count,
    evidenceItems: importedEvidence,
    lastUpdated:
      activeInvestigations[0]?.updatedAt ?? null,
  },
];

if (
  await tableExists(
    "attribution_assessments"
  )
) {
  attributionSummary =
    await dbAll(`
      SELECT
        COALESCE(
          threat_actor,
          campaign_name,
          'Unknown Actor'
        ) as actor,
        confidence,
        (
          SELECT COUNT(*)
          FROM findings f
          WHERE f.case_id = aa.case_id
        ) as supportingFindings,
        (
          SELECT COUNT(*)
          FROM evidence e
          WHERE e.caseId = aa.case_id
        ) as evidenceItems,
        updated_at as lastUpdated
      FROM attribution_assessments aa
      ORDER BY updated_at DESC
      LIMIT 5
    `);
}

async function tableExists(
  tableName: string
): Promise<boolean> {
  const row = await dbGet<{ count: number }>(
    `
    SELECT COUNT(*) as count
    FROM sqlite_master
    WHERE type = 'table'
      AND name = ?
    `,
    [tableName]
  );

  return row.count > 0;
}

  const lessonsPending =
    activeInvestigations
      .filter((item) => item.status !== "CLOSED")
      .slice(0, 5)
      .map((item) => ({
        caseId: item.id,
        caseName: item.caseName,
        reason:
          "Missing post-incident lessons learned documentation",
      }));

  let capaMetrics = {
  open: 0,
  inProgress: 0,
  pendingVerification: 0,
  verified: 0,
  rejected: 0,
  overdue: 0,
};

let rootCauseSummary: {
  category: string;
  count: number;
}[] = [];

if (await tableExists("capa_actions")) {
  const capaRows = await dbAll<{
    status: string;
    count: number;
  }>(`
    SELECT status, COUNT(*) as count
    FROM capa_actions
    GROUP BY status
  `);

  capaMetrics = {
    open:
      capaRows.find((item) => item.status === "OPEN")
        ?.count ?? 0,
    inProgress:
      capaRows.find(
        (item) => item.status === "IN_PROGRESS"
      )?.count ?? 0,
    pendingVerification:
      capaRows.find(
        (item) =>
          item.status === "PENDING_VERIFICATION"
      )?.count ?? 0,
    verified:
      capaRows.find(
        (item) => item.status === "VERIFIED"
      )?.count ?? 0,
    rejected:
      capaRows.find(
        (item) => item.status === "REJECTED"
      )?.count ?? 0,
    overdue: 0,
  };

  const overdue = await dbGet<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM capa_actions
    WHERE due_date IS NOT NULL
      AND due_date < date('now')
      AND status != 'VERIFIED'
  `);

  capaMetrics.overdue = overdue.count;
}

if (await tableExists("lessons_learned")) {
  rootCauseSummary = await dbAll<{
    category: string;
    count: number;
  }>(`
    SELECT
      COALESCE(root_cause_category, 'UNKNOWN') as category,
      COUNT(*) as count
    FROM lessons_learned
    GROUP BY root_cause_category
    ORDER BY count DESC
    LIMIT 6
  `);
}
  return {
    metrics: {
      openCases: openCases.count,
      activeFindings: activeFindings.count,
      evidenceItems: evidenceItems.count,
      attributionModels: attributionSummary.length,
    },
    activeInvestigations,
    recentFindings,
    attackTimeline,
    mitreHeatmap,
    attributionSummary,
    evidenceProcessing: {
      imported: importedEvidence,
      parsed: analyzedEvidence,
      analyzed: analyzedEvidence,
      correlated: activeFindings.count,
      reported: 0,
    },
    lessonsPending,
    capaMetrics,
    rootCauseSummary,
  };
}