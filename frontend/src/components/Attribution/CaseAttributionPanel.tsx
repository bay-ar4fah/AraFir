import { useState } from "react";

import PermissionGuard from "../Auth/PermissionGuard";

import type {
  AttributionConfidence,
  AttributionStatus,
  AttributionWorkspace,
  HypothesisStatus,
} from "../../types/attribution";

interface Props {
  workspace: AttributionWorkspace;
  onUpdateAssessment: (
    payload: Partial<AttributionWorkspace["assessment"]>
  ) => Promise<void>;
  onCreateHypothesis: (payload: {
    assessmentId: string;
    title: string;
    description: string;
    confidence: AttributionConfidence;
  }) => Promise<void>;
  onUpdateHypothesisStatus: (
    hypothesisId: string,
    status: HypothesisStatus
  ) => Promise<void>;
}

const confidenceOptions: AttributionConfidence[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CONFIRMED",
];

const statusOptions: AttributionStatus[] = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
];

const hypothesisStatuses: HypothesisStatus[] = [
  "OPEN",
  "SUPPORTED",
  "REJECTED",
  "CONFIRMED",
];

export default function CaseAttributionPanel({
  workspace,
  onUpdateAssessment,
  onCreateHypothesis,
  onUpdateHypothesisStatus,
}: Props) {
  const { assessment } = workspace;

  const [form, setForm] = useState({
    threatActor: assessment.threatActor ?? "",
    campaignName: assessment.campaignName ?? "",
    motivation: assessment.motivation ?? "",
    initialAccess: assessment.initialAccess ?? "",
    rootCause: assessment.rootCause ?? "",
    finalAssessment: assessment.finalAssessment ?? "",
    recommendedRemediation:
      assessment.recommendedRemediation ?? "",
    confidence: assessment.confidence,
    attributionStatus: assessment.attributionStatus,
  });

  const [hypothesisTitle, setHypothesisTitle] =
    useState("");

  const [hypothesisDescription, setHypothesisDescription] =
    useState("");

  const [hypothesisConfidence, setHypothesisConfidence] =
    useState<AttributionConfidence>("MEDIUM");

  const handleSave = async () => {
    await onUpdateAssessment(form);
  };

  const handleCreateHypothesis = async () => {
    if (!hypothesisTitle.trim()) {
      alert("Hypothesis title is required");
      return;
    }

    await onCreateHypothesis({
      assessmentId: assessment.id,
      title: hypothesisTitle,
      description: hypothesisDescription,
      confidence: hypothesisConfidence,
    });

    setHypothesisTitle("");
    setHypothesisDescription("");
    setHypothesisConfidence("MEDIUM");
  };

  const matrixScore =
    workspace.evidenceMatrix.length === 0
      ? 0
      : Math.round(
          workspace.evidenceMatrix.reduce(
            (total, item) => total + item.weight,
            0
          ) /
            (workspace.evidenceMatrix.length * 5) *
            100
        );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-base font-bold">
              Attribution & Assessment Workspace
            </h2>

            <p className="text-xs text-zinc-400">
              Post-incident attribution, root cause, hypothesis tracking, and final assessment.
            </p>
          </div>

          <div className="flex gap-2">
            <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-400">
              {form.confidence} CONFIDENCE
            </span>

            <span className="rounded border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-400">
              {form.attributionStatus}
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <Field
            label="Threat Actor Candidate"
            value={form.threatActor}
            onChange={(value) =>
              setForm({
                ...form,
                threatActor: value,
              })
            }
            placeholder="e.g. Black Basta, Unknown Actor"
          />

          <Field
            label="Campaign Name"
            value={form.campaignName}
            onChange={(value) =>
              setForm({
                ...form,
                campaignName: value,
              })
            }
            placeholder="e.g. Operation Midnight"
          />

          <Field
            label="Motivation"
            value={form.motivation}
            onChange={(value) =>
              setForm({
                ...form,
                motivation: value,
              })
            }
            placeholder="Financial, espionage, insider, unknown"
          />

          <Field
            label="Initial Access"
            value={form.initialAccess}
            onChange={(value) =>
              setForm({
                ...form,
                initialAccess: value,
              })
            }
            placeholder="VPN, phishing, exposed RDP, web shell"
          />

          <Field
            label="Root Cause"
            value={form.rootCause}
            onChange={(value) =>
              setForm({
                ...form,
                rootCause: value,
              })
            }
            placeholder="Weak password, missing patch, misconfiguration"
          />

          <div>
            <label className="text-xs text-zinc-500">
              Confidence
            </label>

            <select
              value={form.confidence}
              onChange={(e) =>
                setForm({
                  ...form,
                  confidence:
                    e.target.value as AttributionConfidence,
                })
              }
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/80 px-3 py-2 text-xs outline-none"
            >
              {confidenceOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-zinc-500">
              Assessment Status
            </label>

            <select
              value={form.attributionStatus}
              onChange={(e) =>
                setForm({
                  ...form,
                  attributionStatus:
                    e.target.value as AttributionStatus,
                })
              }
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/80 px-3 py-2 text-xs outline-none"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TextArea
          label="Final Assessment"
          value={form.finalAssessment}
          onChange={(value) =>
            setForm({
              ...form,
              finalAssessment: value,
            })
          }
          placeholder="Summarize the most likely actor, objective, and investigative confidence."
        />

        <TextArea
          label="Recommended Remediation"
          value={form.recommendedRemediation}
          onChange={(value) =>
            setForm({
              ...form,
              recommendedRemediation: value,
            })
          }
          placeholder="Recommended corrective actions based on attribution and root cause."
        />

        <PermissionGuard permission="attribution:update">
          <button
            onClick={() => {
              void handleSave();
            }}
            className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold hover:bg-cyan-700"
          >
            Save Attribution Assessment
          </button>
        </PermissionGuard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold">
                Hypothesis Management
              </h3>

              <p className="text-xs text-zinc-400">
                Track competing attribution and root-cause hypotheses.
              </p>
            </div>

            <span className="rounded border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              {workspace.hypotheses.length} hypotheses
            </span>
          </div>

          <PermissionGuard permission="attribution:update">
            <div className="mt-4 rounded-xl border border-zinc-800 bg-black/80 p-4">
              <input
                value={hypothesisTitle}
                onChange={(e) =>
                  setHypothesisTitle(e.target.value)
                }
                placeholder="Hypothesis title"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-cyan-600"
              />

              <textarea
                value={hypothesisDescription}
                onChange={(e) =>
                  setHypothesisDescription(e.target.value)
                }
                placeholder="Hypothesis description"
                className="mt-3 h-20 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none focus:border-cyan-600"
              />

              <div className="mt-3 flex flex-wrap gap-3">
                <select
                  value={hypothesisConfidence}
                  onChange={(e) =>
                    setHypothesisConfidence(
                      e.target.value as AttributionConfidence
                    )
                  }
                  className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none"
                >
                  {confidenceOptions.map((item) => (
                    <option key={item} value={item}>
                      {item} CONFIDENCE
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    void handleCreateHypothesis();
                  }}
                  className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold hover:bg-cyan-700"
                >
                  Add Hypothesis
                </button>
              </div>
            </div>
          </PermissionGuard>

          <div className="mt-4 space-y-3">
            {workspace.hypotheses.length === 0 ? (
              <p className="rounded-xl border border-zinc-800 bg-black/80 p-4 text-xs text-zinc-500">
                No hypothesis created yet.
              </p>
            ) : (
              workspace.hypotheses.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-zinc-800 bg-black/80 p-4"
                >
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-400">
                          {item.confidence}
                        </span>

                        <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-[10px] text-purple-400">
                          {item.status}
                        </span>
                      </div>

                      <h4 className="mt-3 text-sm font-bold">
                        {item.title}
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-zinc-400">
                        {item.description || "-"}
                      </p>
                    </div>

                    <PermissionGuard permission="attribution:update">
                      <select
                        value={item.status}
                        onChange={(e) => {
                          void onUpdateHypothesisStatus(
                            item.id,
                            e.target.value as HypothesisStatus
                          );
                        }}
                        className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none"
                      >
                        {hypothesisStatuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </PermissionGuard>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
            <h3 className="text-base font-bold">
              Evidence Confidence Matrix
            </h3>

            <p className="mt-1 text-xs text-zinc-400">
              Weighted confidence based on reliability and relevance.
            </p>

            <div className="mt-5 flex h-32 w-32 items-center justify-center rounded-full border-[10px] border-cyan-500/60 bg-black">
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {matrixScore}%
                </p>

                <p className="text-[10px] text-zinc-500">
                  Matrix Score
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <Row
                label="Matrix Items"
                value={String(
                  workspace.evidenceMatrix.length
                )}
              />

              <Row
                label="Average Weight"
                value={
                  workspace.evidenceMatrix.length === 0
                    ? "-"
                    : (
                        workspace.evidenceMatrix.reduce(
                          (total, item) =>
                            total + item.weight,
                          0
                        ) /
                        workspace.evidenceMatrix.length
                      ).toFixed(1)
                }
              />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
            <h3 className="text-base font-bold">
              Assessment Metadata
            </h3>

            <div className="mt-4 space-y-2 text-xs">
              <Row
                label="Updated By"
                value={
                  assessment.updatedByName ?? "-"
                }
              />

              <Row
                label="Updated At"
                value={new Date(
                  assessment.updatedAt
                ).toLocaleString()}
              />

              <Row
                label="Reviewed By"
                value={
                  assessment.reviewedByName ?? "-"
                }
              />

              <Row
                label="Reviewed At"
                value={
                  assessment.reviewedAt
                    ? new Date(
                        assessment.reviewedAt
                      ).toLocaleString()
                    : "-"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-zinc-500">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/80 px-3 py-2 text-xs outline-none focus:border-cyan-600"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mt-4">
      <label className="text-xs text-zinc-500">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="mt-1 h-24 w-full rounded-lg border border-zinc-800 bg-black/80 px-3 py-2 text-xs outline-none focus:border-cyan-600"
      />
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b border-zinc-800 pb-2">
      <span className="text-zinc-500">
        {label}
      </span>

      <span className="font-medium text-zinc-200">
        {value}
      </span>
    </div>
  );
}