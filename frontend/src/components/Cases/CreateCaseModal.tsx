import { useEffect, useState } from "react";

import type {
  Case,
  CaseClassification,
  CasePriority,
  InvestigationType,
} from "../../types/case";

import type { AppUser } from "../../types/user";

import {
  getTemplateEvidence,
  INVESTIGATION_TYPE_LABELS,
} from "../../utils/investigationTemplates";

import {
  getCaseAssignableUsers,
} from "../../services/userService";

interface Props {
  onClose: () => void;
  onCreate: (forensicCase: Case) => void;
}

export default function CreateCaseModal({
  onClose,
  onCreate,
}: Props) {
  const [caseName, setCaseName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [investigatorId, setInvestigatorId] =
    useState("");

  const [investigationType, setInvestigationType] =
    useState<InvestigationType>("MULTI_SOURCE");

  const [priority, setPriority] =
    useState<CasePriority>("MEDIUM");

  const [classification, setClassification] =
    useState<CaseClassification>("INTERNAL");

  const [selectedEvidence, setSelectedEvidence] =
    useState<string[]>([]);

  const [assignableUsers, setAssignableUsers] =
    useState<AppUser[]>([]);

  const [isLoadingUsers, setIsLoadingUsers] =
    useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoadingUsers(true);

        const users =
          await getCaseAssignableUsers();

        setAssignableUsers(users);
      } catch (err) {
        console.error(err);

        alert(
          "Failed to load investigator list"
        );
      } finally {
        setIsLoadingUsers(false);
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    setSelectedEvidence(
      getTemplateEvidence(investigationType).map(
        (item) => item.id
      )
    );
  }, []);

  const handleInvestigationTypeChange = (
    value: InvestigationType
  ) => {
    setInvestigationType(value);

    setSelectedEvidence(
      getTemplateEvidence(value).map(
        (item) => item.id
      )
    );
  };

  const handleToggleEvidence = (
    evidenceId: string,
    checked: boolean
  ) => {
    if (checked) {
      setSelectedEvidence((prev) => {
        if (prev.includes(evidenceId)) {
          return prev;
        }

        return [
          ...prev,
          evidenceId,
        ];
      });

      return;
    }

    setSelectedEvidence((prev) =>
      prev.filter((id) => id !== evidenceId)
    );
  };

  const handleSubmit = () => {
    if (!caseName.trim()) {
      alert("Case name is required");
      return;
    }

    if (!investigatorId) {
      alert("Please select investigator");
      return;
    }

    onCreate({
      id: crypto.randomUUID(),
      caseName: caseName.trim(),
      description: description.trim(),
      investigator: "",
      investigatorId,
      createdAt: new Date().toISOString(),
      status: "OPEN",
      investigationType,
      priority,
      classification,
      expectedEvidence:
        JSON.stringify(selectedEvidence),
      caseTags: JSON.stringify([]),
    });
  };

  const evidenceTemplate =
    getTemplateEvidence(investigationType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl scrollbar-hide">
        <div className="mb-5">
          <h2 className="text-2xl font-bold">
            New Investigation Case
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Create a case using an investigation template and expected evidence checklist.
          </p>
        </div>

        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Case Name
              </label>

              <input
                value={caseName}
                onChange={(e) =>
                  setCaseName(e.target.value)
                }
                placeholder="e.g. Malware Outbreak Investigation"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-cyan-600"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Investigator
              </label>

              <select
                value={investigatorId}
                onChange={(e) =>
                  setInvestigatorId(
                    e.target.value
                  )
                }
                disabled={isLoadingUsers}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-cyan-600"
              >
                <option value="">
                  {isLoadingUsers
                    ? "Loading investigators..."
                    : "Select investigator"}
                </option>

                {assignableUsers.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Case Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Briefly describe the case scope, affected assets, or investigation objective."
              className="h-28 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-cyan-600"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Investigation Type
              </label>

              <select
                value={investigationType}
                onChange={(e) =>
                  handleInvestigationTypeChange(
                    e.target.value as InvestigationType
                  )
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-cyan-600"
              >
                {Object.entries(
                  INVESTIGATION_TYPE_LABELS
                ).map(([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as CasePriority
                  )
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-cyan-600"
              >
                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

                <option value="CRITICAL">
                  CRITICAL
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Classification
              </label>

              <select
                value={classification}
                onChange={(e) =>
                  setClassification(
                    e.target.value as CaseClassification
                  )
                }
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-cyan-600"
              >
                <option value="INTERNAL">
                  INTERNAL
                </option>

                <option value="CONFIDENTIAL">
                  CONFIDENTIAL
                </option>

                <option value="RESTRICTED">
                  RESTRICTED
                </option>

                <option value="LEGAL_HOLD">
                  LEGAL HOLD
                </option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Expected Evidence
                </h3>

                <p className="text-xs text-zinc-500">
                  Auto-generated based on investigation type. You can adjust it before creating the case.
                </p>
              </div>

              <span className="shrink-0 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">
                {selectedEvidence.length} selected
              </span>
            </div>

            <div className="mt-4 grid max-h-56 gap-3 overflow-y-auto pr-1 scrollbar-hide md:grid-cols-2">
              {evidenceTemplate.map((item) => {
                const checked =
                  selectedEvidence.includes(
                    item.id
                  );

                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-xs transition ${
                      checked
                        ? "border-cyan-500/40 bg-cyan-500/10"
                        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        handleToggleEvidence(
                          item.id,
                          e.target.checked
                        )
                      }
                      className="mt-1"
                    />

                    <div>
                      <p className="font-medium text-zinc-200">
                        {item.label}
                      </p>

                      <p className="text-zinc-500">
                        {item.category}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-zinc-800 pt-5">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-700"
          >
            Create Case
          </button>
        </div>
      </div>
    </div>
  );
}