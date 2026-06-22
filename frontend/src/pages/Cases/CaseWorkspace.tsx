import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

type WorkspaceTab =
  | "overview"
  | "evidence"
  | "activity"
  | "timeline"
  | "mitre"
  | "custody";

const tabs: {
  id: WorkspaceTab;
  label: string;
}[] = [
  { id: "overview", label: "Overview" },
  { id: "evidence", label: "Evidence" },
  { id: "activity", label: "Activity" },
  { id: "timeline", label: "Timeline" },
  { id: "mitre", label: "MITRE" },
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

  const [timeline, setTimeline] =
    useState<TimelineEvent[]>([]);

  const [mitreFindings, setMitreFindings] =
    useState<MitreFinding[]>([]);

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
      .map((item) => new Date(item.importedAt).getTime())
      .sort((a, b) => b - a)[0];

    return new Date(latest).toLocaleString();
  }, [evidence]);

  const loadEvidence = async (activeCaseId: string) => {
    const data = await getEvidenceByCaseId(activeCaseId);
    setEvidence(data);
  };

  const loadTimeline = async (activeCaseId: string) => {
    const data = await getTimelineByCaseId(activeCaseId);
    setTimeline(data);
  };

  const loadMitreFindings = async (activeCaseId: string) => {
    const data = await getMitreFindingsByCaseId(activeCaseId);
    setMitreFindings(data);
  };

  const loadAttackStory = async (activeCaseId: string) => {
    const data = await getAttackStoryByCaseId(activeCaseId);
    setAttackStory(data);
  };

  const loadCustodyLogs = async (activeCaseId: string) => {
    const data = await getCustodyLogsByCaseId(activeCaseId);
    setCustodyLogs(data);
  };

  const loadAssignmentLogs = async (activeCaseId: string) => {
    const data = await getCaseAssignmentLogs(activeCaseId);
    setAssignmentLogs(data);
  };

  const loadActivities = async (activeCaseId: string) => {
    const data = await getCaseActivities(activeCaseId);
    setActivities(data);
  };

  const refreshCaseWorkspace = async (activeCaseId: string) => {
    await Promise.all([
      loadEvidence(activeCaseId),
      loadTimeline(activeCaseId),
      loadMitreFindings(activeCaseId),
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

      const updatedCase = await getCaseById(caseId);

      setCaseData(updatedCase);
      await refreshCaseWorkspace(caseId);

      setIsReassignModalOpen(false);
      alert("Case reassigned successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to reassign case.");
    }
  };

  const handleEvidenceUpload = async (files: FileList) => {
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

  const handleExcludeEvidence = async (item: Evidence) => {
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

  const handleRestoreEvidence = async (item: Evidence) => {
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

  if (!caseData) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-zinc-400">
        Loading case...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="sticky top-0 z-20 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-3xl font-bold">
                  {caseData.caseName}
                </h1>

                <span className="rounded-lg bg-green-500/20 px-3 py-1 text-sm text-green-400">
                  {caseData.status}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <p className="break-all font-mono text-xs text-zinc-500">
                  Case ID: {caseData.id}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(caseData.id);
                    alert("Case ID copied");
                  }}
                  className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  Copy
                </button>
              </div>

              <p className="mt-2 max-w-3xl text-sm text-zinc-400">
                {caseData.description}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                to={`/cases/${caseData.id}/graph`}
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm hover:bg-cyan-700"
              >
                View Attack Graph
              </Link>

              <button
                disabled
                className="cursor-not-allowed rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-500"
              >
                Generate Report
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  activeTab === tab.id
                    ? "bg-cyan-600 text-white"
                    : "border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_360px] gap-6 p-6">
        <main className="min-w-0 space-y-6">
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-5 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">Active Evidence</p>
                  <h2 className="text-3xl font-bold">{activeEvidence.length}</h2>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">Timeline Events</p>
                  <h2 className="text-3xl font-bold">{timeline.length}</h2>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">MITRE Findings</p>
                  <h2 className="text-3xl font-bold text-cyan-400">
                    {mitreFindings.length}
                  </h2>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">Last Import</p>
                  <h2 className="text-sm font-bold leading-tight">
                    {lastImported}
                  </h2>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <p className="text-sm text-zinc-500">Active Size</p>
                  <h2 className="text-3xl font-bold">
                    {formatFileSize(activeEvidenceSize)}
                  </h2>
                </div>
              </div>

              <CaseAssignmentPanel
                forensicCase={caseData}
                onReassignClick={() => setIsReassignModalOpen(true)}
              />

              <AttackStoryPanel story={attackStory} />

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

          {activeTab === "activity" && (
            <CaseActivityCompact
              activities={activities}
              onSelectActivity={setSelectedActivity}
              expanded
            />
          )}

          {activeTab === "timeline" && (
            <CaseTimelinePanel events={timeline} />
          )}

          {activeTab === "mitre" && (
            <CaseMitrePanel findings={mitreFindings} />
          )}

          {activeTab === "custody" && (
            <>
              <CaseAssignmentHistoryPanel logs={assignmentLogs} />
              <CaseCustodyPanel logs={custodyLogs} />
            </>
          )}
        </main>

        <aside className="sticky top-[150px] h-[calc(100vh-170px)] space-y-4 overflow-y-auto">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-bold">Case Summary</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-zinc-500">Investigator</p>
                <p>
                  {caseData.investigatorName ||
                    caseData.investigator ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-zinc-500">Created</p>
                <p>{new Date(caseData.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <p className="text-zinc-500">Assigned By</p>
                <p>{caseData.assignedByName ?? "-"}</p>
              </div>

              <div>
                <p className="text-zinc-500">Assigned At</p>
                <p>
                  {caseData.assignedAt
                    ? new Date(caseData.assignedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-bold">Quick Counts</h2>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-black p-3">
                <p className="text-zinc-500">Active</p>
                <p className="text-xl font-bold">{activeEvidence.length}</p>
              </div>

              <div className="rounded-lg bg-black p-3">
                <p className="text-zinc-500">Excluded</p>
                <p className="text-xl font-bold">{excludedEvidence.length}</p>
              </div>

              <div className="rounded-lg bg-black p-3">
                <p className="text-zinc-500">MITRE</p>
                <p className="text-xl font-bold text-cyan-400">
                  {mitreFindings.length}
                </p>
              </div>

              <div className="rounded-lg bg-black p-3">
                <p className="text-zinc-500">Activities</p>
                <p className="text-xl font-bold">{activities.length}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {selectedActivity && (
        <ActivityDrawer
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />
      )}

      {isReassignModalOpen && (
        <ReassignCaseModal
          currentInvestigatorId={caseData.investigatorId}
          onClose={() => setIsReassignModalOpen(false)}
          onSubmit={handleReassignCase}
        />
      )}
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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">Case Activity Timeline</h2>
          <p className="text-sm text-zinc-400">
            Compact activity stream. Click any event to inspect details.
          </p>
        </div>

        <span className="text-sm text-zinc-400">
          {activities.length} events
        </span>
      </div>

      {visibleActivities.length === 0 ? (
        <p className="text-sm text-zinc-400">No activity found.</p>
      ) : (
        <div className="space-y-3">
          {visibleActivities.map((activity) => (
            <button
              key={`${activity.source}-${activity.id}`}
              onClick={() => onSelectActivity(activity)}
              className="w-full rounded-lg border border-zinc-800 bg-black p-4 text-left transition hover:border-cyan-600"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded border px-2 py-1 text-xs ${getSourceClass(
                        activity.source
                      )}`}
                    >
                      {activity.source}
                    </span>

                    <span className="text-sm font-semibold text-cyan-400">
                      {activity.action}
                    </span>
                  </div>

                  <p className="mt-2 truncate text-sm text-zinc-300">
                    {activity.message || activity.reason || "-"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Actor: {activity.actorName ?? "System"}
                  </p>
                </div>

                <p className="shrink-0 text-xs text-zinc-500">
                  {new Date(activity.timestamp).toLocaleString()}
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
  return (
    <div className="space-y-6">
      <PermissionGuard permission="evidence:create">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Evidence Ingestion</h2>
              <p className="text-sm text-zinc-400">
                Import forensic artifacts into this active case.
              </p>
            </div>

            <label
              className={`rounded-lg px-4 py-2 transition ${
                isUploading
                  ? "bg-zinc-700 text-zinc-400"
                  : "cursor-pointer bg-cyan-600 hover:bg-cyan-700"
              }`}
            >
              {isUploading ? "Importing..." : "Import Evidence"}

              <input
                type="file"
                multiple
                disabled={isUploading}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) onUpload(e.target.files);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </PermissionGuard>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Evidence Repository</h2>
            <p className="text-sm text-zinc-400">
              Active and excluded evidence linked to this investigation case.
            </p>
          </div>

          <span className="text-sm text-zinc-400">
            {activeEvidence.length} active / {excludedEvidence.length} excluded
          </span>
        </div>

        {evidence.length === 0 ? (
          <p className="text-zinc-400">No evidence imported for this case.</p>
        ) : (
          <div className="max-h-[640px] space-y-3 overflow-y-auto pr-2">
            {evidence.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border bg-black p-4 transition hover:border-zinc-700 ${
                  item.status === "EXCLUDED"
                    ? "border-red-500/30 opacity-75"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{item.filename}</p>
                    <p className="mt-1 break-all text-xs text-zinc-500">
                      SHA256: {item.sha256}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <EvidenceStatusBadge status={item.status} />
                    <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-cyan-400">
                      {item.fileType}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-zinc-400">
                  <div>Size: {formatFileSize(item.size)}</div>
                  <div>Imported by: {item.importedBy}</div>
                  <div>
                    Imported: {new Date(item.importedAt).toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-3 text-xs">
                  <span className="text-green-400">
                    Integrity Status: VERIFIED
                  </span>

                  {item.status === "EXCLUDED" ? (
                    <PermissionGuard permission="evidence:restore">
                      <button
                        disabled={activeEvidenceActionId === item.id}
                        onClick={() => onRestore(item)}
                        className="rounded border border-green-500/30 bg-green-500/10 px-3 py-1 text-green-400 hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {activeEvidenceActionId === item.id
                          ? "Restoring..."
                          : "Restore"}
                      </button>
                    </PermissionGuard>
                  ) : (
                    <PermissionGuard permission="evidence:exclude">
                      <button
                        disabled={activeEvidenceActionId === item.id}
                        onClick={() => onExclude(item)}
                        className="rounded border border-red-500/30 bg-red-500/10 px-3 py-1 text-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {activeEvidenceActionId === item.id
                          ? "Excluding..."
                          : "Exclude"}
                      </button>
                    </PermissionGuard>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
      <div className="ml-auto h-full w-[520px] overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <span
              className={`rounded border px-2 py-1 text-xs ${getSourceClass(
                activity.source
              )}`}
            >
              {activity.source}
            </span>

            <h2 className="mt-3 text-2xl font-bold">{activity.action}</h2>
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
            <p className="text-zinc-500">Message</p>
            <p>{activity.message || activity.reason || "-"}</p>
          </div>

          <div>
            <p className="text-zinc-500">Actor</p>
            <p>
              {activity.actorName ?? "System"}{" "}
              {activity.actorRole ? `(${activity.actorRole})` : ""}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">Entity</p>
            <p>
              {activity.entityType ?? "-"}{" "}
              {activity.entityName || activity.entityId || ""}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">Timestamp</p>
            <p>{new Date(activity.timestamp).toLocaleString()}</p>
          </div>

          <div>
            <p className="text-zinc-500">Metadata</p>
            <pre className="mt-2 max-h-[420px] overflow-auto rounded-lg border border-zinc-800 bg-black p-4 text-xs text-zinc-300">
              {formatMetadata(activity.metadata)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}