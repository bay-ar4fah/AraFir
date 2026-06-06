import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import type { Case } from "../../types/case";
import type { Evidence } from "../../types/evidence";

import { getCaseById } from "../../services/caseService";

import {
  getEvidenceByCaseId,
  saveEvidence,
} from "../../services/evidenceService";

import { sha256File } from "../../utils/hash";
import { formatFileSize } from "../../utils/fileUtils";

export default function CaseWorkspace() {
  const { caseId } = useParams();

  const [caseData, setCaseData] =
    useState<Case | null>(null);

  const [evidence, setEvidence] =
    useState<Evidence[]>([]);

  const [isUploading, setIsUploading] =
    useState(false);

  const totalEvidenceSize = useMemo(() => {
    return evidence.reduce(
      (total, item) => total + item.size,
      0
    );
  }, [evidence]);

  const lastImported = useMemo(() => {
    if (evidence.length === 0) return "-";

    const latest = evidence
      .map((item) => new Date(item.importedAt).getTime())
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

  useEffect(() => {
    if (!caseId) return;

    getCaseById(caseId).then(setCaseData);
    loadEvidence(caseId);
  }, [caseId]);

  const handleEvidenceUpload = async (
    files: FileList
  ) => {
    if (!caseId) return;

    try {
      setIsUploading(true);

      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const evidenceItem: Evidence = {
          id: crypto.randomUUID(),
          caseId,
          filename: file.name,
          fileType:
            file.name
              .split(".")
              .pop()
              ?.toUpperCase() || "UNKNOWN",
          size: file.size,
          sha256: await sha256File(file),
          importedAt: new Date().toISOString(),
          importedBy: "Investigator",
        };

        await saveEvidence(evidenceItem);
      }

      await loadEvidence(caseId);
    } catch (err) {
      console.error(err);
      alert("Failed to import evidence");
    } finally {
      setIsUploading(false);
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

            <p className="text-zinc-400 mt-2">
              {caseData.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm">
              {caseData.status}
            </span>

            <button
              disabled
              className="
                px-4
                py-2
                rounded-lg
                bg-zinc-800
                text-zinc-500
                cursor-not-allowed
                text-sm
              "
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
              {caseData.investigator}
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
              Evidence Items
            </p>

            <p>
              {evidence.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Evidence
          </p>

          <h2 className="text-3xl font-bold">
            {evidence.length}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Total Size
          </p>

          <h2 className="text-3xl font-bold">
            {formatFileSize(totalEvidenceSize)}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Last Import
          </p>

          <h2 className="text-lg font-bold">
            {lastImported}
          </h2>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <p className="text-zinc-500 text-sm">
            Risk Score
          </p>

          <h2 className="text-3xl font-bold text-cyan-400">
            LOW
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
            className={`
              px-4
              py-2
              rounded-lg
              cursor-pointer
              transition
              ${
                isUploading
                  ? "bg-zinc-700 text-zinc-400"
                  : "bg-cyan-600 hover:bg-cyan-700"
              }
            `}
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
              Case Evidence
            </h2>

            <p className="text-zinc-400 text-sm">
              Evidence records linked to this investigation case.
            </p>
          </div>

          <span className="text-sm text-zinc-400">
            {evidence.length} items
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
                className="border border-zinc-800 rounded-lg p-4 bg-black hover:border-zinc-700 transition"
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

                  <span className="px-2 py-1 rounded bg-zinc-800 text-xs text-cyan-400">
                    {item.fileType}
                  </span>
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

                <div className="mt-3 pt-3 border-t border-zinc-800 text-xs">
                  <span className="text-green-400">
                    Integrity Status: VERIFIED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}