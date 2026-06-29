import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Upload,
  Search,
  SlidersHorizontal,
  FileText,
  UserRound,
  CalendarDays,
  Clock3,
  CheckCircle2,
  GitBranch,
  Shield,
  Activity,
  Database,
  MoreVertical,
} from "lucide-react";

import type { Case } from "../../types/case";
import type { Evidence } from "../../types/evidence";
import type { TimelineEvent } from "../../types/timeline";
import type { MitreFinding } from "../../types/mitreFinding";
import type { AttackStory } from "../../types/attackStory";
import type { CustodyLog } from "../../types/custody";
import type { CaseAssignmentLog } from "../../types/caseAssignment";
import type { CaseActivityItem } from "../../types/caseActivity";

import {
  getCaseById,
  reassignCase,
  getCaseAssignmentLogs,
} from "../../services/caseService";

import {
  getEvidenceByCaseId,
  excludeEvidence,
  restoreEvidence,
} from "../../services/evidenceService";

import { getTimelineByCaseId } from "../../services/timelineService";
import { getMitreFindingsByCaseId } from "../../services/mitreFindingService";
import { getAttackStoryByCaseId } from "../../services/attackStoryService";
import { getCustodyLogsByCaseId } from "../../services/custodyService";
import { getCaseActivities } from "../../services/caseActivityService";
import { uploadArtifact } from "../../services/artifactService";

import CaseTimelinePanel from "../../components/Timeline/CaseTimelinePanel";
import CaseMitrePanel from "../../components/Mitre/CaseMitrePanel";
import AttackStoryPanel from "../../components/AttackStory/AttackStoryPanel";
import EvidenceStatusBadge from "../../components/Evidence/EvidenceStatusBadge";
import CaseCustodyPanel from "../../components/Custody/CaseCustodyPanel";
import CaseAssignmentPanel from "../../components/Cases/CaseAssignmentPanel";
import CaseAssignmentHistoryPanel from "../../components/Cases/CaseAssignmentHistoryPanel";
import ReassignCaseModal from "../../components/Cases/ReassignCaseModal";
import PermissionGuard from "../../components/Auth/PermissionGuard";

import { formatFileSize } from "../../utils/fileUtils";

import type {
  Finding,
  FindingConfidence,
  FindingSeverity,
  FindingStatus,
} from "../../types/finding";

import {
  createFinding,
  deleteFindingById,
  getFindingsByCaseId,
  updateFinding,
} from "../../services/findingService";

import CaseFindingsPanel from "../../components/Findings/CaseFindingsPanel";

import type {
  AttributionWorkspace,
  AttributionConfidence,
  HypothesisStatus,
} from "../../types/attribution";

import {
  createAttributionHypothesis,
  getAttributionWorkspace,
  updateAttributionAssessment,
  updateAttributionHypothesis,
} from "../../services/attributionService";

import CaseAttributionPanel from "../../components/Attribution/CaseAttributionPanel";

type WorkspaceTab =
  | "overview"
  | "evidence"
  | "findings"
  | "activity"
  | "timeline"
  | "mitre"
  | "attribution"
  | "custody";

const tabs: {
  id: WorkspaceTab;
  label: string;
}[] = [
  { id: "overview", label: "Overview" },
  { id: "evidence", label: "Evidence" },
  { id: "findings", label: "Findings" },
  { id: "activity", label: "Activity" },
  { id: "timeline", label: "Timeline" },
  { id: "mitre", label: "MITRE" },
  { id: "attribution", label: "Attribution" },
  { id: "custody", label: "Custody" },
];

function getSourceClass(source: string) {
  if (source === "AUDIT") {
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
  }

  if (source === "CUSTODY") {
    return "bg-purple-500/10 text-purple-400 border-purple-500/30";
  }

  if (source === "ASSIGNMENT") {
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
  }

  return "bg-green-500/10 text-green-400 border-green-500/30";
}

function formatMetadata(metadata: string | null) {
  if (!metadata) return "-";

  try {
    return JSON.stringify(JSON.parse(metadata), null, 2);
  } catch {
    return metadata;
  }
}

export default function CaseWorkspace() {
  const { caseId } = useParams();

  const [activeTab, setActiveTab] =
    useState<WorkspaceTab>("overview");

  const [caseData, setCaseData] =
    useState<Case | null>(null);

  const [evidence, setEvidence] =
    useState<Evidence[]>([]);

  const [findings, setFindings] =
    useState<Finding[]>([]);

  const [timeline, setTimeline] =
    useState<TimelineEvent[]>([]);

  const [mitreFindings, setMitreFindings] =
    useState<MitreFinding[]>([]);

  const [attributionWorkspace, setAttributionWorkspace] =
    useState<AttributionWorkspace | null>(null);

  const [attackStory, setAttackStory] =
    useState<AttackStory | null>(null);

  const [custodyLogs, setCustodyLogs] =
    useState<CustodyLog[]>([]);

  const [assignmentLogs, setAssignmentLogs] =
    useState<CaseAssignmentLog[]>([]);

  const [activities, setActivities] =
    useState<CaseActivityItem[]>([]);

  const [selectedActivity, setSelectedActivity] =
    useState<CaseActivityItem | null>(null);

  const [isReassignModalOpen, setIsReassignModalOpen] =
    useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  const [activeEvidenceActionId, setActiveEvidenceActionId] =
    useState<string | null>(null);

  const activeEvidence = useMemo(() => {
    return evidence.filter(
      (item) => item.status !== "EXCLUDED"
    );
  }, [evidence]);

  const excludedEvidence = useMemo(() => {
    return evidence.filter(
      (item) => item.status === "EXCLUDED"
    );
  }, [evidence]);

  const activeEvidenceSize = useMemo(() => {
    return activeEvidence.reduce(
      (total, item) => total + item.size,
      0
    );
  }, [activeEvidence]);

  const lastImported = useMemo(() => {
    if (evidence.length === 0) return "-";

    const latest = evidence
      .map((item) =>
        new Date(item.importedAt).getTime()
      )
      .sort((a, b) => b - a)[0];

    return new Date(latest).toLocaleString();
  }, [evidence]);

  const loadEvidence = async (
    activeCaseId: string
  ) => {
    const data =
      await getEvidenceByCaseId(activeCaseId);

    setEvidence(data);
  };

  const loadFindings = async (
    activeCaseId: string
  ) => {
    const data =
      await getFindingsByCaseId(activeCaseId);

    setFindings(data);
  };

  const loadTimeline = async (
    activeCaseId: string
  ) => {
    const data =
      await getTimelineByCaseId(activeCaseId);

    setTimeline(data);
  };

  const loadMitreFindings = async (
    activeCaseId: string
  ) => {
    const data =
      await getMitreFindingsByCaseId(activeCaseId);

    setMitreFindings(data);
  };

  const loadAttributionWorkspace = async (
      activeCaseId: string
    ) => {
      const data =
        await getAttributionWorkspace(activeCaseId);

      setAttributionWorkspace(data);
    };

  const loadAttackStory = async (
    activeCaseId: string
  ) => {
    const data =
      await getAttackStoryByCaseId(activeCaseId);

    setAttackStory(data);
  };

  const loadCustodyLogs = async (
    activeCaseId: string
  ) => {
    const data =
      await getCustodyLogsByCaseId(activeCaseId);

    setCustodyLogs(data);
  };

  const loadAssignmentLogs = async (
    activeCaseId: string
  ) => {
    const data =
      await getCaseAssignmentLogs(activeCaseId);

    setAssignmentLogs(data);
  };

  const loadActivities = async (
    activeCaseId: string
  ) => {
    const data =
      await getCaseActivities(activeCaseId);

    setActivities(data);
  };

  const refreshCaseWorkspace = async (
    activeCaseId: string
  ) => {
    await Promise.all([
      loadEvidence(activeCaseId),
      loadTimeline(activeCaseId),
      loadFindings(activeCaseId),
      loadMitreFindings(activeCaseId),
      loadAttributionWorkspace(activeCaseId),
      loadAttackStory(activeCaseId),
      loadCustodyLogs(activeCaseId),
      loadAssignmentLogs(activeCaseId),
      loadActivities(activeCaseId),
    ]);
  };

  useEffect(() => {
    if (!caseId) return;

    getCaseById(caseId).then(setCaseData);
    refreshCaseWorkspace(caseId);
  }, [caseId]);

  const handleReassignCase = async (
    investigatorId: string,
    reason: string
  ) => {
    if (!caseId) return;

    try {
      await reassignCase({
        caseId,
        investigatorId,
        reason,
      });

      const updatedCase =
        await getCaseById(caseId);

      setCaseData(updatedCase);
      await refreshCaseWorkspace(caseId);

      setIsReassignModalOpen(false);

      alert("Case reassigned successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to reassign case.");
    }
  };

  const handleEvidenceUpload = async (
    files: FileList
  ) => {
    if (!caseId) return;

    try {
      setIsUploading(true);

      for (const file of Array.from(files)) {
        await uploadArtifact(caseId, file);
      }

      await refreshCaseWorkspace(caseId);
      setActiveTab("evidence");
    } catch (err) {
      console.error(err);
      alert("Failed to import artifact");
    } finally {
      setIsUploading(false);
    }
  };

  const handleExcludeEvidence = async (
    item: Evidence
  ) => {
    if (!caseId) return;

    const reason = window.prompt(
      `Reason for excluding ${item.filename}?`,
      "Irrelevant or wrong evidence uploaded"
    );

    if (!reason || reason.trim().length === 0) {
      alert("Exclude cancelled. Reason is required.");
      return;
    }

    const confirmed = window.confirm(
      `Exclude evidence "${item.filename}" from active analysis?`
    );

    if (!confirmed) return;

    try {
      setActiveEvidenceActionId(item.id);

      await excludeEvidence({
        evidenceId: item.id,
        caseId,
        reason,
      });

      await refreshCaseWorkspace(caseId);

      alert("Evidence excluded successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to exclude evidence. Check backend logs.");
    } finally {
      setActiveEvidenceActionId(null);
    }
  };

  const handleRestoreEvidence = async (
    item: Evidence
  ) => {
    if (!caseId) return;

    const confirmed = window.confirm(
      `Restore evidence "${item.filename}" back to active analysis?`
    );

    if (!confirmed) return;

    try {
      setActiveEvidenceActionId(item.id);

      await restoreEvidence(
        item.id,
        caseId,
        "Evidence restored to active analysis"
      );

      await refreshCaseWorkspace(caseId);

      alert("Evidence restored successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to restore evidence. Check backend logs.");
    } finally {
      setActiveEvidenceActionId(null);
    }
  };

    const handleCreateFinding = async (payload: {
  title: string;
  description: string;
  severity: FindingSeverity;
  confidence: FindingConfidence;
}) => {
  if (!caseId) return;

  await createFinding(caseId, payload);
  await refreshCaseWorkspace(caseId);
};

const handleUpdateFindingStatus = async (
  finding: Finding,
  status: FindingStatus
) => {
  if (!caseId) return;

  await updateFinding(finding.id, {
    status,
  });

  await refreshCaseWorkspace(caseId);
};

const handleDeleteFinding = async (
    finding: Finding
  ) => {
    if (!caseId) return;

    const confirmed = window.confirm(
      `Delete finding "${finding.title}"?`
    );

    if (!confirmed) return;

    await deleteFindingById(finding.id);
    await refreshCaseWorkspace(caseId);
  };

  if (!caseData) {
    return (
      <div className="min-h-screen bg-zinc-950 p-5 text-sm text-zinc-400">
        Loading case...
      </div>
    );
  }

const handleUpdateAttributionAssessment = async (
  payload: Partial<AttributionWorkspace["assessment"]>
) => {
  if (!caseId) return;

  try {
    await updateAttributionAssessment(caseId, payload);

    await refreshCaseWorkspace(caseId);

    alert("Attribution assessment saved successfully.");
  } catch (err) {
    console.error(err);

    alert("Failed to save attribution assessment.");
  }
};

const handleCreateAttributionHypothesis = async (
  payload: {
    assessmentId: string;
    title: string;
    description: string;
    confidence: AttributionConfidence;
  }
) => {
  if (!caseId) return;

  await createAttributionHypothesis(caseId, payload);
  await refreshCaseWorkspace(caseId);
};

const handleUpdateAttributionHypothesisStatus = async (
  hypothesisId: string,
  status: HypothesisStatus
) => {
  if (!caseId) return;

  await updateAttributionHypothesis(hypothesisId, {
    status,
  });

  await refreshCaseWorkspace(caseId);
};

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/60">
        <div className="mx-auto max-w-[1600px] px-5 py-5">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,760px)]">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
                <Link
                  to="/cases"
                  className="hover:text-cyan-400"
                >
                  Cases
                </Link>

                <span>/</span>

                <span className="truncate">
                  {caseData.caseName}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-2xl font-bold tracking-tight md:text-3xl">
                  {caseData.caseName}
                </h1>

                <span className="rounded-lg bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  {caseData.status}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs text-zinc-500">
                  Case ID: {caseData.id}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(caseData.id);
                    alert("Case ID copied");
                  }}
                  className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  Copy
                </button>
              </div>

              <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-400">
                {caseData.description}
              </p>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                      activeTab === tab.id
                        ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/10"
                        : "border border-zinc-800 bg-black/30 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap justify-start gap-3 xl:justify-end">
                <Link
                  to={`/cases/${caseData.id}/graph`}
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold hover:bg-cyan-700"
                >
                  <GitBranch size={16} />
                  View Attack Graph
                </Link>

                <button
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-500"
                >
                  <FileText size={16} />
                  Generate Report
                </button>

                <button className="rounded-xl border border-zinc-800 px-3 py-2.5 text-zinc-400 hover:bg-zinc-900">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="grid rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20 sm:grid-cols-2 xl:grid-cols-5">
                <HeaderMetric
                  icon={<Database size={14} />}
                  label="Active Evidence"
                  value={activeEvidence.length}
                  accent="cyan"
                />

                <HeaderMetric
                  icon={<CheckCircle2 size={14} />}
                  label="Excluded"
                  value={excludedEvidence.length}
                  accent="green"
                />

                <HeaderMetric
                  icon={<Activity size={14} />}
                  label="Timeline Events"
                  value={timeline.length}
                  accent="cyan"
                />

                <HeaderMetric
                  icon={<Shield size={14} />}
                  label="MITRE Findings"
                  value={mitreFindings.length}
                  accent="purple"
                />

                <HeaderMetric
                  icon={<Clock3 size={14} />}
                  label="Last Import"
                  value={
                    lastImported === "-"
                      ? "-"
                      : new Date(lastImported).toLocaleDateString()
                  }
                  subValue={
                    lastImported === "-"
                      ? undefined
                      : new Date(lastImported).toLocaleTimeString()
                  }
                  accent="yellow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1600px] gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_390px]">
        <main className="min-w-0 space-y-5">
          {activeTab === "overview" && (
            <>
              <CaseAssignmentPanel
                forensicCase={caseData}
                onReassignClick={() =>
                  setIsReassignModalOpen(true)
                }
              />

              <AttackStoryPanel
                story={attackStory}
              />

              <CaseActivityCompact
                activities={activities}
                onSelectActivity={setSelectedActivity}
              />
            </>
          )}

          {activeTab === "evidence" && (
            <EvidenceWorkspace
              evidence={evidence}
              activeEvidence={activeEvidence}
              excludedEvidence={excludedEvidence}
              isUploading={isUploading}
              activeEvidenceActionId={activeEvidenceActionId}
              onUpload={handleEvidenceUpload}
              onExclude={handleExcludeEvidence}
              onRestore={handleRestoreEvidence}
            />
          )}

          {activeTab === "findings" && (
            <CaseFindingsPanel
              findings={findings}
              onCreate={handleCreateFinding}
              onUpdateStatus={handleUpdateFindingStatus}
              onDelete={handleDeleteFinding}
            />
          )}

          {activeTab === "activity" && (
            <CaseActivityCompact
              activities={activities}
              onSelectActivity={setSelectedActivity}
              expanded
            />
          )}

          {activeTab === "timeline" && (
            <CaseTimelinePanel
              events={timeline}
            />
          )}

          {activeTab === "mitre" && (
            <CaseMitrePanel
              findings={mitreFindings}
            />
          )}

          {activeTab === "attribution" && (
            attributionWorkspace ? (
              <CaseAttributionPanel
                workspace={attributionWorkspace}
                onUpdateAssessment={
                  handleUpdateAttributionAssessment
                }
                onCreateHypothesis={
                  handleCreateAttributionHypothesis
                }
                onUpdateHypothesisStatus={
                  handleUpdateAttributionHypothesisStatus
                }
              />
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 text-xs text-zinc-400">
                Loading attribution workspace...
              </div>
            )
          )}

          {activeTab === "custody" && (
            <>
              <CaseAssignmentHistoryPanel
                logs={assignmentLogs}
              />

              <CaseCustodyPanel
                logs={custodyLogs}
              />
            </>
          )}
        </main>

        <aside className="space-y-4 xl:sticky xl:top-5 xl:self-start">
          <CaseSummaryCard
            caseData={caseData}
          />

          <QuickActionsCard
            caseData={caseData}
            onReassign={() =>
              setIsReassignModalOpen(true)
            }
          />

          <QuickCountsCard
            activeEvidence={activeEvidence.length}
            excludedEvidence={excludedEvidence.length}
            timeline={timeline.length}
            findings={findings.length}
            mitre={mitreFindings.length}
            activities={activities.length}
            custody={custodyLogs.length}
            activeSize={activeEvidenceSize}
          />

          <p className="text-center text-xs text-zinc-500">
            All times are displayed in your local time zone.
          </p>
        </aside>
      </div>

      {selectedActivity && (
        <ActivityDrawer
          activity={selectedActivity}
          onClose={() =>
            setSelectedActivity(null)
          }
        />
      )}

      {isReassignModalOpen && (
        <ReassignCaseModal
          currentInvestigatorId={
            caseData.investigatorId
          }
          onClose={() =>
            setIsReassignModalOpen(false)
          }
          onSubmit={handleReassignCase}
        />
      )}
    </div>
  );
}

function HeaderMetric({
  icon,
  label,
  value,
  subValue,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  accent: "cyan" | "green" | "purple" | "yellow";
}) {
  const color = {
    cyan: "text-cyan-400",
    green: "text-green-400",
    purple: "text-purple-400",
    yellow: "text-yellow-400",
  }[accent];

  return (
    <div className="border-b border-zinc-800 p-4 sm:border-r sm:border-b-0 last:border-r-0">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span className={color}>
          {icon}
        </span>

        {label}
      </div>

      <p className="mt-2 text-2xl font-bold leading-tight">
        {value}
      </p>

      {subValue && (
        <p className="text-xs text-zinc-500">
          {subValue}
        </p>
      )}
    </div>
  );
}

function CaseSummaryCard({
  caseData,
}: {
  caseData: Case;
}) {
  return (
    <SideCard title="Case Summary">
      <div className="space-y-4">
        <SummaryRow
          icon={<UserRound size={16} />}
          label="Investigator"
          value={
            caseData.investigatorName ||
            caseData.investigator ||
            "-"
          }
        />

        <SummaryRow
          icon={<CalendarDays size={16} />}
          label="Created"
          value={new Date(
            caseData.createdAt
          ).toLocaleString()}
        />

        <SummaryRow
          icon={<UserRound size={16} />}
          label="Assigned By"
          value={caseData.assignedByName ?? "-"}
        />

        <SummaryRow
          icon={<Clock3 size={16} />}
          label="Assigned At"
          value={
            caseData.assignedAt
              ? new Date(
                  caseData.assignedAt
                ).toLocaleString()
              : "-"
          }
        />

        <SummaryRow
          icon={<CheckCircle2 size={16} />}
          label="Status"
          value={caseData.status}
          accent
        />
      </div>
    </SideCard>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="grid grid-cols-[20px_1fr_1.35fr] items-center gap-2 text-xs">
      <span className="text-zinc-500">
        {icon}
      </span>

      <p className="text-zinc-400">
        {label}
      </p>

      <p
        className={`truncate text-right font-medium ${
          accent
            ? "text-green-400"
            : "text-zinc-200"
        }`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function QuickActionsCard({
  caseData,
  onReassign,
}: {
  caseData: Case;
  onReassign: () => void;
}) {
  return (
    <SideCard title="Quick Actions">
      <div className="grid grid-cols-3 gap-3">
        <PermissionGuard permission="case:assign">
          <button
            onClick={onReassign}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-4 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20"
          >
            <UserRound size={18} />
            Reassign
          </button>
        </PermissionGuard>

        <Link
          to={`/cases/${caseData.id}/graph`}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-4 text-center text-xs font-medium text-purple-300 hover:bg-purple-500/20"
        >
          <GitBranch size={18} />
          Graph
        </Link>

        <button
          disabled
          className="flex cursor-not-allowed flex-col items-center justify-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 px-3 py-4 text-xs font-medium text-yellow-700"
        >
          <FileText size={18} />
          Report
        </button>
      </div>
    </SideCard>
  );
}

function QuickCountsCard({
  activeEvidence,
  excludedEvidence,
  timeline,
  findings,
  mitre,
  activities,
  custody,
  activeSize,
}: {
  activeEvidence: number;
  excludedEvidence: number;
  timeline: number;
  findings:number;
  mitre: number;
  activities: number;
  custody: number;
  activeSize: number;
}) {
  return (
    <SideCard title="Quick Counts">
      <div className="grid grid-cols-2 gap-3 text-xs">
        <MiniCount
          label="Active Evidence"
          value={activeEvidence}
        />

        <MiniCount
          label="Excluded"
          value={excludedEvidence}
        />
        <MiniCount
          label="Timeline Events"
          value={timeline}
        />
        <MiniCount
          label="Findings"
          value={findings}
        />

        <MiniCount
          label="MITRE Findings"
          value={mitre}
          accent
        />

        <MiniCount
          label="Activities"
          value={activities}
        />

        <MiniCount
          label="Custody Logs"
          value={custody}
        />
      </div>

      <div className="mt-3 rounded-xl border border-zinc-800 bg-black/80 p-3">
        <p className="text-xs text-zinc-500">
          Active Evidence Size
        </p>

        <p className="mt-1 text-lg font-bold">
          {formatFileSize(activeSize)}
        </p>
      </div>
    </SideCard>
  );
}

function SideCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
      <h2 className="mb-4 text-base font-bold">
        {title}
      </h2>

      {children}
    </div>
  );
}

function MiniCount({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/80 p-3">
      <p className="text-[11px] text-zinc-500">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${
          accent ? "text-cyan-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function CaseActivityCompact({
  activities,
  onSelectActivity,
  expanded = false,
}: {
  activities: CaseActivityItem[];
  onSelectActivity: (activity: CaseActivityItem) => void;
  expanded?: boolean;
}) {
  const visibleActivities = expanded
    ? activities
    : activities.slice(0, 8);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold">
            Case Activity Timeline
          </h2>

          <p className="text-xs text-zinc-400">
            Unified stream from audit, custody, assignment, and timeline events.
          </p>
        </div>

        <span className="text-xs text-zinc-400">
          {activities.length} events
        </span>
      </div>

      {visibleActivities.length === 0 ? (
        <p className="text-xs text-zinc-400">
          No activity found.
        </p>
      ) : (
        <div className="space-y-3">
          {visibleActivities.map((activity) => (
            <button
              key={`${activity.source}-${activity.id}`}
              onClick={() =>
                onSelectActivity(activity)
              }
              className="w-full rounded-xl border border-zinc-800 bg-black/80 p-3 text-left transition hover:border-cyan-600"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-2 py-1 text-[10px] ${getSourceClass(
                        activity.source
                      )}`}
                    >
                      {activity.source}
                    </span>

                    <span className="text-xs font-semibold text-cyan-400">
                      {activity.action}
                    </span>
                  </div>

                  <p className="mt-2 truncate text-xs text-zinc-300">
                    {activity.message ||
                      activity.reason ||
                      "-"}
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    Actor: {activity.actorName ?? "System"}
                  </p>
                </div>

                <p className="shrink-0 text-[11px] text-zinc-500">
                  {new Date(
                    activity.timestamp
                  ).toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EvidenceWorkspace({
  evidence,
  activeEvidence,
  excludedEvidence,
  isUploading,
  activeEvidenceActionId,
  onUpload,
  onExclude,
  onRestore,
}: {
  evidence: Evidence[];
  activeEvidence: Evidence[];
  excludedEvidence: Evidence[];
  isUploading: boolean;
  activeEvidenceActionId: string | null;
  onUpload: (files: FileList) => void;
  onExclude: (item: Evidence) => void;
  onRestore: (item: Evidence) => void;
}) {
  const [statusFilter, setStatusFilter] =
    useState<"ACTIVE" | "EXCLUDED" | "ALL">(
      "ACTIVE"
    );

  const [search, setSearch] =
    useState("");

  const visibleEvidence = useMemo(() => {
    return evidence.filter((item) => {
      if (
        statusFilter === "ACTIVE" &&
        item.status === "EXCLUDED"
      ) {
        return false;
      }

      if (
        statusFilter === "EXCLUDED" &&
        item.status !== "EXCLUDED"
      ) {
        return false;
      }

      const searchable = [
        item.filename,
        item.sha256,
        item.fileType,
        item.importedBy,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(
        search.toLowerCase()
      );
    });
  }, [evidence, search, statusFilter]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-base font-bold">
            Evidence Repository
          </h2>

          <p className="text-xs text-zinc-400">
            Active and excluded evidence linked to this investigation case.
          </p>
        </div>

        <PermissionGuard permission="evidence:create">
          <label
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              isUploading
                ? "bg-zinc-700 text-zinc-400"
                : "cursor-pointer bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
            <Upload size={15} />
            {isUploading
              ? "Importing..."
              : "Import Evidence"}

            <input
              type="file"
              multiple
              disabled={isUploading}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  onUpload(e.target.files);
                }

                e.currentTarget.value = "";
              }}
            />
          </label>
        </PermissionGuard>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-[auto_auto_minmax(220px,1fr)_auto_auto]">
        <button
          onClick={() =>
            setStatusFilter("ACTIVE")
          }
          className={`rounded-lg px-4 py-2 text-xs ${
            statusFilter === "ACTIVE"
              ? "bg-cyan-600 text-white"
              : "border border-zinc-800 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Active ({activeEvidence.length})
        </button>

        <button
          onClick={() =>
            setStatusFilter("EXCLUDED")
          }
          className={`rounded-lg px-4 py-2 text-xs ${
            statusFilter === "EXCLUDED"
              ? "bg-red-600 text-white"
              : "border border-zinc-800 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          Excluded ({excludedEvidence.length})
        </button>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search evidence..."
            className="w-full rounded-lg border border-zinc-800 bg-black/80 py-2 pl-9 pr-3 text-xs outline-none focus:border-cyan-600"
          />
        </div>

        <button className="rounded-lg border border-zinc-800 px-3 py-2 text-zinc-400 hover:bg-zinc-800">
          <SlidersHorizontal size={15} />
        </button>

        <button className="rounded-lg border border-zinc-800 px-3 py-2 text-zinc-400 hover:bg-zinc-800">
          <GitBranch size={15} />
        </button>
      </div>

      {visibleEvidence.length === 0 ? (
        <p className="mt-5 text-xs text-zinc-400">
          No evidence found.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {visibleEvidence.map((item) => (
            <EvidenceCard
              key={item.id}
              item={item}
              activeEvidenceActionId={
                activeEvidenceActionId
              }
              onExclude={onExclude}
              onRestore={onRestore}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EvidenceCard({
  item,
  activeEvidenceActionId,
  onExclude,
  onRestore,
}: {
  item: Evidence;
  activeEvidenceActionId: string | null;
  onExclude: (item: Evidence) => void;
  onRestore: (item: Evidence) => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-black/80 transition hover:border-zinc-700 ${
        item.status === "EXCLUDED"
          ? "border-red-500/30 opacity-80"
          : "border-zinc-800"
      }`}
    >
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-[10px] font-bold text-cyan-400">
              <FileText size={24} />
              <span className="mt-1 rounded bg-cyan-600 px-1.5 py-0.5 text-white">
                {item.fileType}
              </span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                {item.filename}
              </p>

              <p className="mt-1 break-all font-mono text-[11px] text-zinc-500">
                SHA256: {item.sha256}
              </p>

              <div className="mt-3 grid gap-3 text-xs text-zinc-400 sm:grid-cols-3">
                <InfoBlock
                  label="Size"
                  value={formatFileSize(item.size)}
                />

                <InfoBlock
                  label="Imported By"
                  value={item.importedBy}
                />

                <InfoBlock
                  label="Imported"
                  value={new Date(
                    item.importedAt
                  ).toLocaleString()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <EvidenceStatusBadge
            status={item.status}
          />

          <span className="rounded bg-zinc-800 px-2 py-1 text-[11px] text-cyan-400">
            {item.fileType}
          </span>

          <button className="rounded-lg px-2 py-1 text-zinc-400 hover:bg-zinc-800">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3 text-xs">
        <span className="text-green-400">
          Integrity Status: VERIFIED
        </span>

        {item.status === "EXCLUDED" ? (
          <PermissionGuard permission="evidence:restore">
            <button
              disabled={
                activeEvidenceActionId === item.id
              }
              onClick={() =>
                onRestore(item)
              }
              className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs text-green-400 hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeEvidenceActionId === item.id
                ? "Restoring..."
                : "Restore"}
            </button>
          </PermissionGuard>
        ) : (
          <PermissionGuard permission="evidence:exclude">
            <button
              disabled={
                activeEvidenceActionId === item.id
              }
              onClick={() =>
                onExclude(item)
              }
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {activeEvidenceActionId === item.id
                ? "Excluding..."
                : "Exclude"}
            </button>
          </PermissionGuard>
        )}
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-zinc-500">
        {label}
      </p>

      <p
        className="truncate text-zinc-200"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function ActivityDrawer({
  activity,
  onClose,
}: {
  activity: CaseActivityItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60">
      <div className="ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`rounded border px-2 py-1 text-xs ${getSourceClass(
                activity.source
              )}`}
            >
              {activity.source}
            </span>

            <h2 className="mt-3 text-2xl font-bold">
              {activity.action}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-4 text-sm">
          <div>
            <p className="text-zinc-500">
              Message
            </p>

            <p>
              {activity.message ||
                activity.reason ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Actor
            </p>

            <p>
              {activity.actorName ?? "System"}{" "}
              {activity.actorRole
                ? `(${activity.actorRole})`
                : ""}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Entity
            </p>

            <p>
              {activity.entityType ?? "-"}{" "}
              {activity.entityName ||
                activity.entityId ||
                ""}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Timestamp
            </p>

            <p>
              {new Date(
                activity.timestamp
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Metadata
            </p>

            <pre className="mt-2 max-h-[420px] overflow-auto rounded-lg border border-zinc-800 bg-black p-4 text-xs text-zinc-300">
              {formatMetadata(activity.metadata)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}