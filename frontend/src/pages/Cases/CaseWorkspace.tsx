import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import type { Case } from "../../types/case";
import type { Evidence } from "../../types/evidence";
import type { TimelineEvent } from "../../types/timeline";
import type { MitreFinding } from "../../types/mitreFinding";
import type { AttackStory } from "../../types/attackStory";
import type { CustodyLog } from "../../types/custody";
import type { CaseAssignmentLog } from "../../types/caseAssignment";

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

import {
  getTimelineByCaseId,
} from "../../services/timelineService";

import {
  getMitreFindingsByCaseId,
} from "../../services/mitreFindingService";

import {
  getAttackStoryByCaseId,
} from "../../services/attackStoryService";

import {
  getCustodyLogsByCaseId,
} from "../../services/custodyService";

import {
  uploadArtifact,
} from "../../services/artifactService";

import CaseTimelinePanel from "../../components/Timeline/CaseTimelinePanel";
import CaseMitrePanel from "../../components/Mitre/CaseMitrePanel";
import AttackStoryPanel from "../../components/AttackStory/AttackStoryPanel";
import EvidenceStatusBadge from "../../components/Evidence/EvidenceStatusBadge";
import CaseCustodyPanel from "../../components/Custody/CaseCustodyPanel";

import CaseAssignmentPanel from "../../components/Cases/CaseAssignmentPanel";
import CaseAssignmentHistoryPanel from "../../components/Cases/CaseAssignmentHistoryPanel";
import ReassignCaseModal from "../../components/Cases/ReassignCaseModal";

import { formatFileSize } from "../../utils/fileUtils";

export default function CaseWorkspace() {
  const { caseId } = useParams();

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

  const refreshCaseWorkspace = async (
    activeCaseId: string
  ) => {
    await Promise.all([
      loadEvidence(activeCaseId),
      loadTimeline(activeCaseId),
      loadMitreFindings(activeCaseId),
      loadAttackStory(activeCaseId),
      loadCustodyLogs(activeCaseId),
      loadAssignmentLogs(activeCaseId),
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

      const fileArray = Array.from(files);

      for (const file of fileArray) {
        await uploadArtifact(caseId, file);
      }

      await refreshCaseWorkspace(caseId);
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

  if (!caseData) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-zinc-400">
        Loading case...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 space-y-6 text-white">
      <div className="bg-black border border-zinc-800 border-l-4 border-l-cyan-500 rounded-xl p-6 shadow-lg shadow-black/40">
        <div className="flex justify-between items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold">
              {caseData.caseName}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-zinc-500 font-mono break-all">
                Case ID: {caseData.id}
              </p>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(caseData.id);
                  alert("Case ID copied");
                }}
                className="text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                Copy
              </button>
            </div>

            <p className="text-zinc-400 mt-2">
              {caseData.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm">
              {caseData.status}
            </span>

            <Link
              to={`/cases/${caseData.id}/graph`}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-sm"
            >
              View Attack Graph
            </Link>

            <button
              disabled
              className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-500 cursor-not-allowed text-sm"
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
          <div>
            <p className="text-zinc-500">
              Investigator
            </p>

            <p>
              {caseData.investigatorName ||
                caseData.investigator ||
                "-"}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Created
            </p>

            <p>
              {new Date(
                caseData.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Active Evidence
            </p>

            <p>
              {activeEvidence.length}
            </p>
          </div>
        </div>
      </div>

      <CaseAssignmentPanel
        forensicCase={caseData}
        onReassignClick={() =>
          setIsReassignModalOpen(true)
        }
      />

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Active Evidence
          </p>

          <h2 className="text-3xl font-bold">
            {activeEvidence.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Timeline Events
          </p>

          <h2 className="text-3xl font-bold">
            {timeline.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            MITRE Findings
          </p>

          <h2 className="text-3xl font-bold text-cyan-400">
            {mitreFindings.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Last Import
          </p>

          <h2 className="text-sm font-bold leading-tight">
            {lastImported}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Active Size
          </p>

          <h2 className="text-3xl font-bold">
            {formatFileSize(activeEvidenceSize)}
          </h2>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Evidence Ingestion
            </h2>

            <p className="text-zinc-400 text-sm">
              Import forensic artifacts into this active case.
            </p>
          </div>

          <label
            className={`px-4 py-2 rounded-lg cursor-pointer transition ${
              isUploading
                ? "bg-zinc-700 text-zinc-400"
                : "bg-cyan-600 hover:bg-cyan-700"
            }`}
          >
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
                  handleEvidenceUpload(e.target.files);
                }

                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">
              Evidence Repository
            </h2>

            <p className="text-zinc-400 text-sm">
              Active and excluded evidence linked to this investigation case.
            </p>
          </div>

          <span className="text-sm text-zinc-400">
            {activeEvidence.length} active /{" "}
            {excludedEvidence.length} excluded
          </span>
        </div>

        {evidence.length === 0 ? (
          <p className="text-zinc-400">
            No evidence imported for this case.
          </p>
        ) : (
          <div className="space-y-3">
            {evidence.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 bg-black hover:border-zinc-700 transition ${
                  item.status === "EXCLUDED"
                    ? "border-red-500/30 opacity-75"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold">
                      {item.filename}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1 break-all">
                      SHA256: {item.sha256}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <EvidenceStatusBadge
                      status={item.status}
                    />

                    <span className="px-2 py-1 rounded bg-zinc-800 text-xs text-cyan-400">
                      {item.fileType}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 text-xs text-zinc-400">
                  <div>
                    Size: {formatFileSize(item.size)}
                  </div>

                  <div>
                    Imported by: {item.importedBy}
                  </div>

                  <div>
                    Imported:{" "}
                    {new Date(
                      item.importedAt
                    ).toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-green-400">
                    Integrity Status: VERIFIED
                  </span>

                  {item.status === "EXCLUDED" ? (
                    <button
                      disabled={
                        activeEvidenceActionId === item.id
                      }
                      onClick={() =>
                        handleRestoreEvidence(item)
                      }
                      className="px-3 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {activeEvidenceActionId === item.id
                        ? "Restoring..."
                        : "Restore"}
                    </button>
                  ) : (
                    <button
                      disabled={
                        activeEvidenceActionId === item.id
                      }
                      onClick={() =>
                        handleExcludeEvidence(item)
                      }
                      className="px-3 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {activeEvidenceActionId === item.id
                        ? "Excluding..."
                        : "Exclude"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CaseTimelinePanel
        events={timeline}
      />

      <CaseMitrePanel
        findings={mitreFindings}
      />

      <AttackStoryPanel
        story={attackStory}
      />

      <CaseAssignmentHistoryPanel
        logs={assignmentLogs}
      />

      <CaseCustodyPanel
        logs={custodyLogs}
      />

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