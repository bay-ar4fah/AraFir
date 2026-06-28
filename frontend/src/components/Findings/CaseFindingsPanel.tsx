import { useState } from "react";

import PermissionGuard from "../Auth/PermissionGuard";

import type {
  Finding,
  FindingConfidence,
  FindingSeverity,
  FindingStatus,
} from "../../types/finding";

interface Props {
  findings: Finding[];
  onCreate: (payload: {
    title: string;
    description: string;
    severity: FindingSeverity;
    confidence: FindingConfidence;
  }) => Promise<void>;
  onUpdateStatus: (
    finding: Finding,
    status: FindingStatus
  ) => Promise<void>;
  onDelete: (finding: Finding) => Promise<void>;
}

const severities: FindingSeverity[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
  "INFO",
];

const confidences: FindingConfidence[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

const statuses: FindingStatus[] = [
  "OPEN",
  "REVIEWED",
  "CONFIRMED",
  "REJECTED",
];

function severityClass(severity: FindingSeverity) {
  if (severity === "CRITICAL") {
    return "border-red-500/40 text-red-400 bg-red-500/10";
  }

  if (severity === "HIGH") {
    return "border-orange-500/40 text-orange-400 bg-orange-500/10";
  }

  if (severity === "MEDIUM") {
    return "border-yellow-500/40 text-yellow-400 bg-yellow-500/10";
  }

  if (severity === "LOW") {
    return "border-blue-500/40 text-blue-400 bg-blue-500/10";
  }

  return "border-zinc-500/40 text-zinc-400 bg-zinc-500/10";
}

export default function CaseFindingsPanel({
  findings,
  onCreate,
  onUpdateStatus,
  onDelete,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [severity, setSeverity] =
    useState<FindingSeverity>("MEDIUM");

  const [confidence, setConfidence] =
    useState<FindingConfidence>("MEDIUM");

  const [isCreating, setIsCreating] =
    useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert("Finding title is required");
      return;
    }

    try {
      setIsCreating(true);

      await onCreate({
        title,
        description,
        severity,
        confidence,
      });

      setTitle("");
      setDescription("");
      setSeverity("MEDIUM");
      setConfidence("MEDIUM");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-base font-bold">
            Findings Repository
          </h2>

          <p className="text-xs text-zinc-400">
            Investigator-confirmed findings linked to evidence, timeline, and MITRE context.
          </p>
        </div>

        <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
          {findings.length} findings
        </span>
      </div>

      <PermissionGuard permission="finding:create">
        <div className="mt-5 rounded-xl border border-zinc-800 bg-black/80 p-4">
          <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto]">
            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Finding title"
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-cyan-600"
            />

            <select
              value={severity}
              onChange={(e) =>
                setSeverity(
                  e.target.value as FindingSeverity
                )
              }
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none"
            >
              {severities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={confidence}
              onChange={(e) =>
                setConfidence(
                  e.target.value as FindingConfidence
                )
              }
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none"
            >
              {confidences.map((item) => (
                <option key={item} value={item}>
                  {item} CONFIDENCE
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Finding description / forensic reasoning"
            className="mt-3 h-24 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-cyan-600"
          />

          <button
            onClick={() => {
              void handleCreate();
            }}
            disabled={isCreating}
            className="mt-3 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating
              ? "Creating..."
              : "Create Finding"}
          </button>
        </div>
      </PermissionGuard>

      <div className="mt-5 space-y-3">
        {findings.length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-black/80 p-4 text-xs text-zinc-500">
            No findings created yet.
          </p>
        ) : (
          findings.map((finding) => (
            <div
              key={finding.id}
              className="rounded-xl border border-zinc-800 bg-black/80 p-4"
            >
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded border px-2 py-1 text-[10px] font-semibold ${severityClass(
                        finding.severity
                      )}`}
                    >
                      {finding.severity}
                    </span>

                    <span className="rounded border border-zinc-700 px-2 py-1 text-[10px] text-zinc-300">
                      {finding.confidence} CONFIDENCE
                    </span>

                    <span className="rounded border border-cyan-500/30 px-2 py-1 text-[10px] text-cyan-400">
                      {finding.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold">
                    {finding.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    {finding.description || "-"}
                  </p>

                  <div className="mt-3 grid gap-2 text-[11px] text-zinc-500 md:grid-cols-3">
                    <span>
                      Created by: {finding.createdByName}
                    </span>

                    <span>
                      Created:{" "}
                      {new Date(
                        finding.createdAt
                      ).toLocaleString()}
                    </span>

                    <span>
                      Technique:{" "}
                      {finding.techniqueId ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <PermissionGuard permission="finding:update">
                    <select
                      value={finding.status}
                      onChange={(e) => {
                        void onUpdateStatus(
                          finding,
                          e.target.value as FindingStatus
                        );
                      }}
                      className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none"
                    >
                      {statuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </PermissionGuard>

                  <PermissionGuard permission="finding:delete">
                    <button
                      onClick={() => {
                        void onDelete(finding);
                      }}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </PermissionGuard>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}