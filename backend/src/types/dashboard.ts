export interface DashboardMetric {
  label: string;
  value: number;
  delta?: string;
}

export interface DashboardCaseItem {
  id: string;
  caseName: string;
  description: string | null;
  investigator: string | null;
  status: string | null;
  evidenceCount: number;
  findingCount: number;
  updatedAt: string | null;
}

export interface DashboardFindingItem {
  id: string;
  caseId: string | null;
  caseName: string | null;
  title: string;
  severity: string | null;
  source: string | null;
  createdAt: string | null;
}

export interface DashboardTimelineItem {
  id: string;
  caseId: string | null;
  caseName: string | null;
  time: string | null;
  eventType: string | null;
  description: string | null;
  source: string | null;
  severity: string | null;
}

export interface DashboardMitreHeatmapItem {
  tactic: string;
  count: number;
}

export interface DashboardAttributionItem {
  actor: string;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  supportingFindings: number;
  evidenceItems: number;
  lastUpdated: string | null;
}

export interface DashboardEvidenceProcessing {
  imported: number;
  parsed: number;
  analyzed: number;
  correlated: number;
  reported: number;
}

export interface DashboardLessonsPendingItem {
  caseId: string;
  caseName: string;
  reason: string;
}

export interface InvestigationDashboard {
  metrics: {
    openCases: number;
    activeFindings: number;
    evidenceItems: number;
    attributionModels: number;
  };
  activeInvestigations: DashboardCaseItem[];
  recentFindings: DashboardFindingItem[];
  attackTimeline: DashboardTimelineItem[];
  mitreHeatmap: DashboardMitreHeatmapItem[];
  attributionSummary: DashboardAttributionItem[];
  evidenceProcessing: DashboardEvidenceProcessing;
  lessonsPending: DashboardLessonsPendingItem[];

  capaMetrics: DashboardCapaMetrics;
  rootCauseSummary: DashboardRootCauseItem[];
}

export interface DashboardCapaMetrics {
  open: number;
  inProgress: number;
  pendingVerification: number;
  verified: number;
  rejected: number;
  overdue: number;
}

export interface DashboardRootCauseItem {
  category: string;
  count: number;
}