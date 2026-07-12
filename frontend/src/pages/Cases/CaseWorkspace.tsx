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
  Copy,
  Cpu,
  ChevronRight,
  BookOpen,
  HardDrive,
  AlertTriangle,
} from "lucide-react";

import type { Case, InvestigationType } from "../../types/case";
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
import EvidenceStatusBadge from "../../components/Evidence/EvidenceStatusBadge";
import CaseCustodyPanel from "../../components/Custody/CaseCustodyPanel";
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

import type {
  CaseAttributionProjection,
} from "../../types/attributionProjection";

import {
  getCaseAttributionProjection,
} from "../../services/attributionProjectionService";

import type {
  CapaStatus,
  LessonsWorkspace,
} from "../../types/lessonsLearned";

import {
  createCapaAction,
  getLessonsWorkspace,
  updateCapaAction,
  updateLessons,
} from "../../services/lessonsLearnedService";

import CaseLessonsPanel from "../../components/Lessons/CaseLessonsPanel";
import {
  getCaseWorkspaceTabs,
  type WorkspaceTab,
} from "../../utils/caseWorkspaceTabs";
import DomainPlaceholderPanel from "../../components/Forensics/DomainPlaceholderPanel";

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

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function formatDateOnly(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
}

function formatTimeOnly(value?: string | null) {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleTimeString();
}

function formatInvestigationType(type?: InvestigationType | string | null) {
  if (!type) return "MULTI SOURCE";

  return type.replaceAll("_", " ");
}

function getAttackNarrative(story: AttackStory | null) {
  if (!story) {
    return "Initial analysis indicates suspicious activity requiring deeper investigation. Evidence, timeline, MITRE mapping, and artifact relationships should be reviewed to reconstruct the attack story.";
  }

  const normalizedStory = story as unknown as {
    narrative?: string;
    summary?: string;
    attackSummary?: string;
    description?: string;
  };

  return (
    normalizedStory.narrative ||
    normalizedStory.summary ||
    normalizedStory.attackSummary ||
    normalizedStory.description ||
    "Attack story data has been loaded. Review timeline, MITRE findings, activities, and evidence relationships to validate the investigation narrative."
  );
}

export default function CaseWorkspace() {
  const { caseId } = useParams();

  const [activeTab, setActiveTab] =
    useState<WorkspaceTab>("overview");

  const domainTabIds: WorkspaceTab[] = [
    "memory",
    "processes",
    "dll",
    "malfind",
    "yara",
    "network",
    "flows",
    "dns",
    "http",
    "tls",
    "files",
    "mobile",
    "apps",
    "messages",
    "calls",
    "location",
    "media",
  ];

  const isDomainTab =
    domainTabIds.includes(activeTab);

  const [caseData, setCaseData] =
    useState<Case | null>(null);

  const workspaceTabs = useMemo(() => {
    return getCaseWorkspaceTabs(
      caseData?.investigationType
    );
  }, [caseData?.investigationType]);

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

  const [attributionProjection, setAttributionProjection] =
    useState<CaseAttributionProjection | null>(null);

  const [lessonsWorkspace, setLessonsWorkspace] =
    useState<LessonsWorkspace | null>(null);

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
    if (evidence.length === 0) return null;

    const latest = evidence
      .map((item) =>
        new Date(item.importedAt).getTime()
      )
      .filter((timestamp) =>
        !Number.isNaN(timestamp)
      )
      .sort((a, b) => b - a)[0];

    if (!latest) return null;

    return new Date(latest).toISOString();
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

  const loadAttributionProjection = async (
    activeCaseId: string
  ) => {
    const data =
      await getCaseAttributionProjection(
        activeCaseId
      );

    setAttributionProjection(data);
  };

  const loadLessonsWorkspace = async (
    activeCaseId: string
  ) => {
    const data =
      await getLessonsWorkspace(activeCaseId);

    setLessonsWorkspace(data);
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
      loadAttributionProjection(activeCaseId),
      loadLessonsWorkspace(activeCaseId),
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

  useEffect(() => {
    if (!caseData) return;

    const allowedTabs =
      getCaseWorkspaceTabs(
        caseData.investigationType
      ).map((tab) => tab.id);

    if (!allowedTabs.includes(activeTab)) {
      setActiveTab("overview");
    }
  }, [
    caseData,
    activeTab,
  ]);

  const handleCopyCaseId = async () => {
    if (!caseData) return;

    await navigator.clipboard.writeText(caseData.id);
    alert("Case ID copied");
  };

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

  const handleUpdateLessons = async (
    payload: Partial<LessonsWorkspace["lessons"]>
  ) => {
    if (!caseId) return;

    await updateLessons(caseId, payload);
    await refreshCaseWorkspace(caseId);

    alert("Lessons learned saved successfully.");
  };

  const handleCreateCapa = async (payload: {
    lessonsLearnedId: string;
    actionType: "CORRECTIVE" | "PREVENTIVE";
    title: string;
    description: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    ownerTeam: string;
    ownerName: string;
    dueDate: string;
  }) => {
    if (!caseId) return;

    await createCapaAction(caseId, payload);
    await refreshCaseWorkspace(caseId);

    alert("CAPA action created successfully.");
  };

  const handleUpdateCapaStatus = async (
    capaId: string,
    status: CapaStatus
  ) => {
    if (!caseId) return;

    await updateCapaAction(capaId, {
      status,
    });

    await refreshCaseWorkspace(caseId);
  };

  if (!caseData) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-sm text-zinc-400">
        Loading case...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-zinc-800 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_36%),linear-gradient(180deg,rgba(9,9,11,1),rgba(24,24,27,0.72))]">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(520px,760px)]">
            <CaseHero
              caseData={caseData}
              onCopyCaseId={handleCopyCaseId}
            />

            <div className="space-y-4">
              <CaseContextStrip
                caseData={caseData}
                lastImported={lastImported}
              />

              <HeaderActions
                caseData={caseData}
                onCopyCaseId={handleCopyCaseId}
              />
            </div>
          </div>

          <WorkspaceTabBar
            tabs={workspaceTabs}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <HeaderMetricsGrid
            activeEvidence={activeEvidence.length}
            excludedEvidence={excludedEvidence.length}
            timelineEvents={timeline.length}
            mitreFindings={mitreFindings.length}
            lastImported={lastImported}
          />
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] p-6">
        {activeTab === "overview" && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
            <main className="min-w-0 space-y-6">
              <CaseAssignmentCard
                caseData={caseData}
                onReassignClick={() =>
                  setIsReassignModalOpen(true)
                }
              />

              <DynamicInvestigationNarrative
                story={attackStory}
              />

              <ActiveModulesCard
                caseId={caseData.id}
                tabs={workspaceTabs}
                investigationType={caseData.investigationType}
                evidenceCount={activeEvidence.length}
                findingsCount={findings.length}
                onSelectTab={setActiveTab}
              />

              <EvidenceSnapshotCard
                evidence={activeEvidence}
                onViewAll={() => setActiveTab("evidence")}
              />

              <CaseActivityCompact
                activities={activities}
                onSelectActivity={setSelectedActivity}
              />
            </main>

            <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
              <CaseSummaryCard
                caseData={caseData}
              />

              <QuickInsightsCard
                timelineEvents={timeline.length}
                mitreFindings={mitreFindings.length}
                findings={findings.length}
                activities={activities.length}
                custodyLogs={custodyLogs.length}
                activeEvidenceSize={activeEvidenceSize}
                lastImported={lastImported}
              />

              <AttributionProjectionCard
                projection={attributionProjection}
              />
            </aside>
          </div>
        )}

        {activeTab !== "overview" && (
          <main className="min-w-0 space-y-6">
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

            {isDomainTab && (
              <DomainPlaceholderPanel
                caseId={caseData.id}
                investigationType={
                  caseData.investigationType
                }
                activeTab={activeTab}
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
                <EmptyPanel text="Loading attribution workspace..." />
              )
            )}

            {activeTab === "lessons" && (
              lessonsWorkspace ? (
                <CaseLessonsPanel
                  workspace={lessonsWorkspace}
                  onUpdateLessons={handleUpdateLessons}
                  onCreateCapa={handleCreateCapa}
                  onUpdateCapaStatus={
                    handleUpdateCapaStatus
                  }
                />
              ) : (
                <EmptyPanel text="Loading lessons learned workspace..." />
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
        )}
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

function CaseHero({
  caseData,
  onCopyCaseId,
}: {
  caseData: Case;
  onCopyCaseId: () => void;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
        <Link
          to="/cases"
          className="font-medium text-cyan-400 hover:text-cyan-300"
        >
          Cases
        </Link>

        <span>/</span>

        <span className="truncate">
          {caseData.caseName}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="truncate text-3xl font-black tracking-tight text-zinc-50 md:text-4xl">
          {caseData.caseName}
        </h1>

        <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
          {caseData.status}
        </span>
      </div>

      <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-400">
        {caseData.description ||
          "No case description available."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-zinc-500">
          Case ID
        </span>

        <button
          type="button"
          onClick={onCopyCaseId}
          className="inline-flex max-w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
        >
          <span className="truncate">
            {caseData.id}
          </span>
          <Copy size={14} />
        </button>
      </div>
    </div>
  );
}

function CaseContextStrip({
  caseData,
  lastImported,
}: {
  caseData: Case;
  lastImported: string | null;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/20 sm:grid-cols-2 xl:grid-cols-4">
      <ContextItem
        icon={<Cpu size={18} />}
        label="Investigation Type"
        value={formatInvestigationType(
          caseData.investigationType
        )}
      />

      <ContextItem
        icon={<span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />}
        label="Priority"
        value={caseData.priority ?? "MEDIUM"}
      />

      <ContextItem
        icon={<UserRound size={18} />}
        label="Investigator"
        value={
          caseData.investigatorName ||
          caseData.investigator ||
          "-"
        }
      />

      <ContextItem
        icon={<CalendarDays size={18} />}
        label="Last Import"
        value={formatDateOnly(lastImported)}
      />
    </div>
  );
}

function ContextItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-zinc-800 xl:border-r xl:last:border-r-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-cyan-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs text-zinc-500">
          {label}
        </p>

        <p
          className="mt-1 truncate text-sm font-semibold text-zinc-100"
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function HeaderActions({
  caseData,
  onCopyCaseId,
}: {
  caseData: Case;
  onCopyCaseId: () => void;
}) {
  return (
    <div className="flex flex-wrap justify-start gap-3 xl:justify-end">
      <button
        type="button"
        onClick={onCopyCaseId}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
      >
        <Copy size={17} />
        Copy ID
      </button>

      <Link
        to={`/cases/${caseData.id}/graph`}
        className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
      >
        <GitBranch size={17} />
        View Attack Graph
      </Link>

      <button
        disabled
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-500"
      >
        <FileText size={17} />
        Generate Report
      </button>

      <button className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-zinc-400 transition hover:bg-zinc-900">
        <MoreVertical size={18} />
      </button>
    </div>
  );
}

function WorkspaceTabBar({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: {
    id: WorkspaceTab;
    label: string;
    group: string;
  }[];
  activeTab: WorkspaceTab;
  onChange: (tab: WorkspaceTab) => void;
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 shadow-lg shadow-black/20">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
              activeTab === tab.id
                ? "bg-cyan-500/15 text-cyan-300 shadow-inner shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                activeTab === tab.id
                  ? "bg-cyan-300"
                  : "bg-zinc-700"
              }`}
            />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HeaderMetricsGrid({
  activeEvidence,
  excludedEvidence,
  timelineEvents,
  mitreFindings,
  lastImported,
}: {
  activeEvidence: number;
  excludedEvidence: number;
  timelineEvents: number;
  mitreFindings: number;
  lastImported: string | null;
}) {
  return (
    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <HeaderMetric
        icon={<Database size={21} />}
        label="Active Evidence"
        value={activeEvidence}
        subValue="Items"
        accent="cyan"
      />

      <HeaderMetric
        icon={<CheckCircle2 size={21} />}
        label="Excluded"
        value={excludedEvidence}
        subValue="Items"
        accent="green"
      />

      <HeaderMetric
        icon={<Activity size={21} />}
        label="Timeline Events"
        value={timelineEvents}
        subValue="Events"
        accent="cyan"
      />

      <HeaderMetric
        icon={<Shield size={21} />}
        label="MITRE Findings"
        value={mitreFindings}
        subValue="Findings"
        accent="purple"
      />

      <HeaderMetric
        icon={<Clock3 size={21} />}
        label="Last Import"
        value={formatDateOnly(lastImported)}
        subValue={formatTimeOnly(lastImported)}
        accent="yellow"
      />
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
  const tone = {
    cyan: "bg-cyan-500/10 text-cyan-300",
    green: "bg-emerald-500/10 text-emerald-300",
    purple: "bg-purple-500/10 text-purple-300",
    yellow: "bg-yellow-500/10 text-yellow-300",
  }[accent];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-zinc-500">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold leading-tight text-zinc-50">
            {value}
          </p>

          {subValue && (
            <p className="text-xs text-zinc-500">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseAssignmentCard({
  caseData,
  onReassignClick,
}: {
  caseData: Case;
  onReassignClick: () => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <UserRound className="text-cyan-300" size={22} />

          <div>
            <h2 className="text-lg font-bold text-zinc-100">
              Case Assignment
            </h2>

            <p className="text-xs text-zinc-500">
              Current responsibility and assignment ownership.
            </p>
          </div>
        </div>

        <PermissionGuard permission="case:assign">
          <button
            type="button"
            onClick={onReassignClick}
            className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-zinc-950 transition hover:bg-cyan-400"
          >
            Reassign
          </button>
        </PermissionGuard>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <InfoBlock
          label="Assigned Investigator"
          value={
            caseData.investigatorName ||
            caseData.investigator ||
            "-"
          }
        />

        <InfoBlock
          label="Assigned By"
          value={caseData.assignedByName ?? "-"}
        />

        <InfoBlock
          label="Assigned At"
          value={formatDateTime(caseData.assignedAt)}
        />

        <InfoBlock
          label="Current Responsibility"
          value="Investigation & Analysis"
        />
      </div>
    </section>
  );
}

function DynamicInvestigationNarrative({
  story,
}: {
  story: AttackStory | null;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-3 flex items-center gap-3">
        <BookOpen className="text-indigo-300" size={22} />

        <h2 className="text-lg font-bold text-zinc-100">
          Dynamic Investigation Narrative
        </h2>
      </div>

      <p className="max-w-4xl text-sm leading-6 text-zinc-400">
        {getAttackNarrative(story)}
      </p>

      <button className="mt-5 inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-500/40 hover:text-cyan-300">
        View Full Attack Story
        <ChevronRight size={15} />
      </button>
    </section>
  );
}

function ActiveModulesCard({
  caseId,
  tabs,
  investigationType,
  evidenceCount,
  findingsCount,
  onSelectTab,
}: {
  caseId: string;
  tabs: {
    id: WorkspaceTab;
    label: string;
    group: string;
  }[];
  investigationType?: InvestigationType;
  evidenceCount: number;
  findingsCount: number;
  onSelectTab: (tab: WorkspaceTab) => void;
}) {
  const domainTabs = tabs.filter(
    (tab) => tab.group === "domain"
  );

  const primaryDomainTab =
    domainTabs.find((tab) => tab.id === "memory") ||
    domainTabs[0];

  const primaryTitle =
    investigationType === "MEMORY_FORENSICS"
      ? "Memory Forensics"
      : primaryDomainTab?.label || "Domain Workspace";

  const primaryDescription =
    investigationType === "MEMORY_FORENSICS"
      ? "Processes, command lines, injected code, memory indicators, and network artifacts."
      : "Case-linked forensic domain module based on investigation type.";

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Cpu className="text-cyan-300" size={22} />

          <div>
            <h2 className="text-lg font-bold text-zinc-100">
              Active Investigation Modules
            </h2>

            <p className="text-xs text-zinc-500">
              Modules activated based on investigation type.
            </p>
          </div>
        </div>

        <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
          {(primaryDomainTab ? 1 : 0) + 1} modules
        </span>
      </div>

      <div className="space-y-3">
        {primaryDomainTab && (
          <ModuleTile
            icon={<Cpu size={28} />}
            title={primaryTitle}
            badge="ACTIVE"
            description={primaryDescription}
            metrics={[
              {
                label: "Evidence",
                value: evidenceCount,
              },
              {
                label: "Findings",
                value: findingsCount,
              },
              {
                label: "Progress",
                value: "68%",
              },
            ]}
            progress={68}
            actionLabel="Open Module"
            onAction={() =>
              onSelectTab(primaryDomainTab.id)
            }
          />
        )}

        <ModuleTile
          icon={<HardDrive size={28} />}
          title="Evidence Imaging"
          badge="NEW"
          description="Acquisition metadata, forensic image records, hashing, write blocker, and verification workflow."
          metrics={[
            {
              label: "Format",
              value: "E01 / RAW",
            },
            {
              label: "Hashing",
              value: "SHA256",
            },
            {
              label: "Status",
              value: "Ready",
            },
          ]}
          actionLabel="Open Imaging"
          to={`/cases/${caseId}/evidence-imaging`}
        />
      </div>
    </section>
  );
}

function ModuleTile({
  icon,
  title,
  badge,
  description,
  metrics,
  progress,
  actionLabel,
  to,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  badge: string;
  description: string;
  metrics: {
    label: string;
    value: string | number;
  }[];
  progress?: number;
  actionLabel: string;
  to?: string;
  onAction?: () => void;
}) {
  const actionContent = (
    <>
      {actionLabel}
      <ChevronRight size={14} />
    </>
  );

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 transition hover:border-cyan-500/30">
      <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_minmax(320px,0.85fr)_auto] lg:items-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
          {icon}
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-zinc-950" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-zinc-100">
              {title}
            </h3>

            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              {badge}
            </span>
          </div>

          <p className="mt-1 max-w-xl text-xs leading-5 text-zinc-500">
            {description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-zinc-800 sm:border-l sm:pl-4"
            >
              <p className="text-[11px] text-zinc-500">
                {metric.label}
              </p>

              <p className="mt-1 text-sm font-bold text-zinc-100">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          {typeof progress === "number" && (
            <div className="h-2 w-full rounded-full bg-zinc-800 lg:w-24">
              <div
                className="h-2 rounded-full bg-cyan-400"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          )}

          {to ? (
            <Link
              to={to}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
            >
              {actionContent}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
            >
              {actionContent}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EvidenceSnapshotCard({
  evidence,
  onViewAll,
}: {
  evidence: Evidence[];
  onViewAll: () => void;
}) {
  const visibleEvidence = evidence.slice(0, 5);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HardDrive className="text-zinc-300" size={22} />

          <h2 className="text-lg font-bold text-zinc-100">
            Evidence Snapshot
          </h2>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200"
        >
          View All Evidence
          <ChevronRight size={14} />
        </button>
      </div>

      {visibleEvidence.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-500">
          No active evidence available.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">
                  Evidence Name
                </th>
                <th className="px-4 py-3 font-medium">
                  Type
                </th>
                <th className="px-4 py-3 font-medium">
                  Size
                </th>
                <th className="px-4 py-3 font-medium">
                  Collected At
                </th>
                <th className="px-4 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800 bg-zinc-950/70">
              {visibleEvidence.map((item) => (
                <tr key={item.id}>
                  <td className="max-w-[280px] truncate px-4 py-3 font-semibold text-zinc-200">
                    {item.filename}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {item.fileType}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {formatFileSize(item.size)}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {formatDateTime(item.importedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <EvidenceStatusBadge
                      status={item.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function CaseSummaryCard({
  caseData,
}: {
  caseData: Case;
}) {
  return (
    <SideCard
      title="Case Summary"
      icon={<Shield size={20} />}
    >
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
          value={formatDateTime(caseData.createdAt)}
        />

        <SummaryRow
          icon={<UserRound size={16} />}
          label="Assigned By"
          value={caseData.assignedByName ?? "-"}
        />

        <SummaryRow
          icon={<Clock3 size={16} />}
          label="Assigned At"
          value={formatDateTime(caseData.assignedAt)}
        />

        <SummaryRow
          icon={<CheckCircle2 size={16} />}
          label="Status"
          value={caseData.status}
          accent="green"
        />

        <SummaryRow
          icon={<Shield size={16} />}
          label="Type"
          value={formatInvestigationType(
            caseData.investigationType
          )}
        />

        <SummaryRow
          icon={<Activity size={16} />}
          label="Priority"
          value={caseData.priority ?? "MEDIUM"}
          accent="yellow"
        />

        <SummaryRow
          icon={<Shield size={16} />}
          label="Classification"
          value={
            caseData.classification ?? "INTERNAL"
          }
        />
      </div>
    </SideCard>
  );
}

function QuickInsightsCard({
  timelineEvents,
  mitreFindings,
  findings,
  activities,
  custodyLogs,
  activeEvidenceSize,
  lastImported,
}: {
  timelineEvents: number;
  mitreFindings: number;
  findings: number;
  activities: number;
  custodyLogs: number;
  activeEvidenceSize: number;
  lastImported: string | null;
}) {
  return (
    <SideCard
      title="Quick Insights"
      icon={<Activity size={20} />}
    >
      <div className="space-y-3">
        <InsightRow
          icon={<Activity size={17} />}
          title="High number of timeline events detected"
          description={`${timelineEvents} events require analysis`}
          tone="cyan"
        />

        <InsightRow
          icon={<Shield size={17} />}
          title={`${mitreFindings} MITRE techniques identified`}
          description="Validate tactics, techniques, and attack stages"
          tone="purple"
        />

        <InsightRow
          icon={<AlertTriangle size={17} />}
          title={`${findings} findings currently tracked`}
          description={`${activities} activities and ${custodyLogs} custody logs are linked`}
          tone="yellow"
        />

        <InsightRow
          icon={<Database size={17} />}
          title="Active evidence footprint"
          description={`${formatFileSize(activeEvidenceSize)} active evidence size`}
          tone="green"
        />

        <InsightRow
          icon={<Clock3 size={17} />}
          title="Latest import completed"
          description={formatDateTime(lastImported)}
          tone="cyan"
        />
      </div>
    </SideCard>
  );
}

function InsightRow({
  icon,
  title,
  description,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: "cyan" | "purple" | "yellow" | "green";
}) {
  const toneClass = {
    cyan: "bg-cyan-500/10 text-cyan-300",
    purple: "bg-purple-500/10 text-purple-300",
    yellow: "bg-yellow-500/10 text-yellow-300",
    green: "bg-emerald-500/10 text-emerald-300",
  }[tone];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 transition hover:border-cyan-500/30">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-100">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-zinc-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={15}
        className="text-cyan-300"
      />
    </div>
  );
}

function AttributionProjectionCard({
  projection,
}: {
  projection: CaseAttributionProjection | null;
}) {
  const confidence =
    projection?.confidence ?? "UNKNOWN";

  const confidenceClass =
    confidence === "CONFIRMED"
      ? "border-green-500/30 bg-green-500/10 text-green-400"
      : confidence === "HIGH"
      ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
      : confidence === "MEDIUM"
      ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
      : confidence === "LOW"
      ? "border-zinc-500/30 bg-zinc-500/10 text-zinc-400"
      : "border-zinc-700 bg-black/40 text-zinc-500";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            Threat Attribution
          </h2>

          <p className="text-xs text-zinc-500">
            Assessment projection
          </p>
        </div>

        <span
          className={`rounded border px-2 py-1 text-[10px] font-semibold ${confidenceClass}`}
        >
          {confidence}
        </span>
      </div>

      <div className="mt-4 space-y-3 text-xs">
        <ProjectionRow
          label="Actor"
          value={
            projection?.threatActor ??
            "Unknown Actor"
          }
        />

        <ProjectionRow
          label="Campaign"
          value={
            projection?.campaignName ??
            "Unassigned"
          }
        />

        <ProjectionRow
          label="Status"
          value={
            projection?.attributionStatus ??
            "DRAFT"
          }
        />

        <ProjectionRow
          label="Initial Access"
          value={
            projection?.initialAccess ??
            "-"
          }
        />

        <ProjectionRow
          label="Root Cause"
          value={
            projection?.rootCause ??
            "-"
          }
        />
      </div>

      {projection?.updatedAt && (
        <p className="mt-4 text-[11px] text-zinc-500">
          Updated: {formatDateTime(projection.updatedAt)}
        </p>
      )}
    </div>
  );
}

function ProjectionRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-2">
      <span className="shrink-0 text-zinc-500">
        {label}
      </span>

      <span
        className="max-w-[220px] text-right font-medium text-zinc-200 line-clamp-2"
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: "green" | "yellow";
}) {
  const accentClass =
    accent === "green"
      ? "text-emerald-300"
      : accent === "yellow"
      ? "text-yellow-300"
      : "text-zinc-200";

  return (
    <div className="grid grid-cols-[20px_1fr_1.35fr] items-center gap-2 text-xs">
      <span className="text-zinc-500">
        {icon}
      </span>

      <p className="text-zinc-400">
        {label}
      </p>

      <p
        className={`truncate text-right font-semibold ${accentClass}`}
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function SideCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center gap-3">
        {icon && (
          <span className="text-zinc-300">
            {icon}
          </span>
        )}

        <h2 className="text-lg font-bold text-zinc-100">
          {title}
        </h2>
      </div>

      {children}
    </section>
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
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            Case Activity Timeline
          </h2>

          <p className="text-xs text-zinc-500">
            Unified stream from audit, custody, assignment, and timeline events.
          </p>
        </div>

        <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs text-zinc-400">
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
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-left transition hover:border-cyan-600"
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
                  {formatDateTime(activity.timestamp)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
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
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            Evidence Repository
          </h2>

          <p className="text-xs text-zinc-500">
            Active and excluded evidence linked to this investigation case.
          </p>
        </div>

        <PermissionGuard permission="evidence:create">
          <label
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
              isUploading
                ? "bg-zinc-700 text-zinc-400"
                : "cursor-pointer bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
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

      <div className="mt-5 grid gap-3 lg:grid-cols-[auto_auto_auto_minmax(220px,1fr)_auto_auto]">
        <button
          onClick={() =>
            setStatusFilter("ACTIVE")
          }
          className={`rounded-lg px-4 py-2 text-xs ${
            statusFilter === "ACTIVE"
              ? "bg-cyan-500 text-zinc-950"
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

        <button
          onClick={() =>
            setStatusFilter("ALL")
          }
          className={`rounded-lg px-4 py-2 text-xs ${
            statusFilter === "ALL"
              ? "bg-zinc-200 text-zinc-950"
              : "border border-zinc-800 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          All ({evidence.length})
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
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-xs outline-none focus:border-cyan-600"
          />
        </div>

        <button className="rounded-lg border border-zinc-800 px-3 py-2 text-zinc-400 hover:bg-zinc-800">
          <SlidersHorizontal size={15} />
        </button>

        <Link
          to="evidence-imaging"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-800 px-3 py-2 text-zinc-400 hover:bg-zinc-800"
        >
          <HardDrive size={15} />
        </Link>
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
    </section>
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
      className={`overflow-hidden rounded-xl border bg-zinc-950/80 transition hover:border-zinc-700 ${
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
              <p className="truncate text-sm font-bold text-zinc-100">
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
                  value={formatDateTime(item.importedAt)}
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
      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p
        className="truncate text-sm font-semibold text-zinc-100"
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
              {formatDateTime(activity.timestamp)}
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

function EmptyPanel({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-sm text-zinc-400 shadow-lg shadow-black/20">
      {text}
    </div>
  );
}
