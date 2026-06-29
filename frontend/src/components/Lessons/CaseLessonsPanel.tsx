import {
  useEffect,
  useState,
} from "react";

import PermissionGuard from "../Auth/PermissionGuard";

import type {
  CapaAction,
  CapaActionType,
  CapaPriority,
  CapaStatus,
  LessonsRootCauseCategory,
  LessonsStatus,
  LessonsWorkspace,
} from "../../types/lessonsLearned";

interface Props {
  workspace: LessonsWorkspace;
  onUpdateLessons: (
    payload: Partial<LessonsWorkspace["lessons"]>
  ) => Promise<void>;
  onCreateCapa: (payload: {
    lessonsLearnedId: string;
    actionType: CapaActionType;
    title: string;
    description: string;
    priority: CapaPriority;
    ownerTeam: string;
    ownerName: string;
    dueDate: string;
  }) => Promise<void>;
  onUpdateCapaStatus: (
    capaId: string,
    status: CapaStatus
  ) => Promise<void>;
}

const rootCauseOptions: LessonsRootCauseCategory[] = [
  "TECHNICAL",
  "PROCESS",
  "HUMAN",
  "BUSINESS",
  "THIRD_PARTY",
  "PHYSICAL",
  "UNKNOWN",
];

const lessonsStatuses: LessonsStatus[] = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "REJECTED",
];

const capaTypes: CapaActionType[] = [
  "CORRECTIVE",
  "PREVENTIVE",
];

const capaPriorities: CapaPriority[] = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW",
];

const capaStatuses: CapaStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "PENDING_VERIFICATION",
  "VERIFIED",
  "REJECTED",
];

export default function CaseLessonsPanel({
  workspace,
  onUpdateLessons,
  onCreateCapa,
  onUpdateCapaStatus,
}: Props) {
  const { lessons } = workspace;

  const [form, setForm] = useState({
    incidentSummary:
      lessons.incidentSummary ?? "",
    whatHappened:
      lessons.whatHappened ?? "",
    whyItHappened:
      lessons.whyItHappened ?? "",
    whatWorked:
      lessons.whatWorked ?? "",
    whatFailed:
      lessons.whatFailed ?? "",
    businessImpact:
      lessons.businessImpact ?? "",
    technicalImpact:
      lessons.technicalImpact ?? "",
    rootCauseCategory:
      lessons.rootCauseCategory ?? "UNKNOWN",
    rootCauseSummary:
      lessons.rootCauseSummary ?? "",
    controlGapSummary:
      lessons.controlGapSummary ?? "",
    overallStatus:
      lessons.overallStatus,
  });

  const [capaForm, setCapaForm] = useState({
    actionType: "CORRECTIVE" as CapaActionType,
    title: "",
    description: "",
    priority: "MEDIUM" as CapaPriority,
    ownerTeam: "",
    ownerName: "",
    dueDate: "",
  });

  useEffect(() => {
    setForm({
      incidentSummary:
        lessons.incidentSummary ?? "",
      whatHappened:
        lessons.whatHappened ?? "",
      whyItHappened:
        lessons.whyItHappened ?? "",
      whatWorked:
        lessons.whatWorked ?? "",
      whatFailed:
        lessons.whatFailed ?? "",
      businessImpact:
        lessons.businessImpact ?? "",
      technicalImpact:
        lessons.technicalImpact ?? "",
      rootCauseCategory:
        lessons.rootCauseCategory ?? "UNKNOWN",
      rootCauseSummary:
        lessons.rootCauseSummary ?? "",
      controlGapSummary:
        lessons.controlGapSummary ?? "",
      overallStatus:
        lessons.overallStatus,
    });
  }, [lessons]);

  const handleSaveLessons = async () => {
    await onUpdateLessons(form);
  };

  const handleCreateCapa = async () => {
    if (!capaForm.title.trim()) {
      alert("CAPA title is required");
      return;
    }

    await onCreateCapa({
      lessonsLearnedId: lessons.id,
      ...capaForm,
    });

    setCapaForm({
      actionType: "CORRECTIVE",
      title: "",
      description: "",
      priority: "MEDIUM",
      ownerTeam: "",
      ownerName: "",
      dueDate: "",
    });
  };

  const verifiedCount =
    workspace.capaActions.filter(
      (item) => item.status === "VERIFIED"
    ).length;

  const overdueCount =
    workspace.capaActions.filter((item) => {
      if (!item.dueDate) return false;
      if (item.status === "VERIFIED") return false;

      return new Date(item.dueDate) < new Date();
    }).length;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-base font-bold">
              Lessons Learned & CAPA Workspace
            </h2>

            <p className="text-xs text-zinc-400">
              Root cause, control gaps, corrective actions, preventive actions, and verification tracking.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>
              {workspace.capaActions.length} CAPA
            </Badge>

            <Badge>
              {verifiedCount} Verified
            </Badge>

            <Badge danger>
              {overdueCount} Overdue
            </Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <TextArea
            label="Incident Summary"
            value={form.incidentSummary}
            onChange={(value) =>
              setForm({
                ...form,
                incidentSummary: value,
              })
            }
          />

          <TextArea
            label="What Happened"
            value={form.whatHappened}
            onChange={(value) =>
              setForm({
                ...form,
                whatHappened: value,
              })
            }
          />

          <TextArea
            label="Why It Happened"
            value={form.whyItHappened}
            onChange={(value) =>
              setForm({
                ...form,
                whyItHappened: value,
              })
            }
          />

          <TextArea
            label="What Failed"
            value={form.whatFailed}
            onChange={(value) =>
              setForm({
                ...form,
                whatFailed: value,
              })
            }
          />

          <TextArea
            label="What Worked"
            value={form.whatWorked}
            onChange={(value) =>
              setForm({
                ...form,
                whatWorked: value,
              })
            }
          />

          <TextArea
            label="Control Gap Summary"
            value={form.controlGapSummary}
            onChange={(value) =>
              setForm({
                ...form,
                controlGapSummary: value,
              })
            }
          />

          <TextArea
            label="Business Impact"
            value={form.businessImpact}
            onChange={(value) =>
              setForm({
                ...form,
                businessImpact: value,
              })
            }
          />

          <TextArea
            label="Technical Impact"
            value={form.technicalImpact}
            onChange={(value) =>
              setForm({
                ...form,
                technicalImpact: value,
              })
            }
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <SelectField
            label="Root Cause Category"
            value={form.rootCauseCategory}
            options={rootCauseOptions}
            onChange={(value) =>
              setForm({
                ...form,
                rootCauseCategory:
                  value as LessonsRootCauseCategory,
              })
            }
          />

          <SelectField
            label="Lessons Status"
            value={form.overallStatus}
            options={lessonsStatuses}
            onChange={(value) =>
              setForm({
                ...form,
                overallStatus:
                  value as LessonsStatus,
              })
            }
          />

          <TextField
            label="Root Cause Summary"
            value={form.rootCauseSummary}
            onChange={(value) =>
              setForm({
                ...form,
                rootCauseSummary: value,
              })
            }
          />
        </div>

        <PermissionGuard permission="lessons:update">
          <button
            onClick={() => {
              void handleSaveLessons();
            }}
            className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold hover:bg-cyan-700"
          >
            Save Lessons Learned
          </button>
        </PermissionGuard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <PermissionGuard permission="lessons:update">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
            <h3 className="text-base font-bold">
              Create CAPA Action
            </h3>

            <p className="mt-1 text-xs text-zinc-400">
              Corrective and preventive actions for verified closure.
            </p>

            <div className="mt-4 space-y-3">
              <SelectField
                label="Action Type"
                value={capaForm.actionType}
                options={capaTypes}
                onChange={(value) =>
                  setCapaForm({
                    ...capaForm,
                    actionType:
                      value as CapaActionType,
                  })
                }
              />

              <TextField
                label="Title"
                value={capaForm.title}
                onChange={(value) =>
                  setCapaForm({
                    ...capaForm,
                    title: value,
                  })
                }
              />

              <TextArea
                label="Description"
                value={capaForm.description}
                onChange={(value) =>
                  setCapaForm({
                    ...capaForm,
                    description: value,
                  })
                }
              />

              <SelectField
                label="Priority"
                value={capaForm.priority}
                options={capaPriorities}
                onChange={(value) =>
                  setCapaForm({
                    ...capaForm,
                    priority:
                      value as CapaPriority,
                  })
                }
              />

              <TextField
                label="Owner Team"
                value={capaForm.ownerTeam}
                onChange={(value) =>
                  setCapaForm({
                    ...capaForm,
                    ownerTeam: value,
                  })
                }
              />

              <TextField
                label="Owner Name"
                value={capaForm.ownerName}
                onChange={(value) =>
                  setCapaForm({
                    ...capaForm,
                    ownerName: value,
                  })
                }
              />

              <TextField
                label="Due Date"
                type="date"
                value={capaForm.dueDate}
                onChange={(value) =>
                  setCapaForm({
                    ...capaForm,
                    dueDate: value,
                  })
                }
              />

              <button
                onClick={() => {
                  void handleCreateCapa();
                }}
                className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold hover:bg-cyan-700"
              >
                Create CAPA
              </button>
            </div>
          </div>
        </PermissionGuard>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
          <h3 className="text-base font-bold">
            CAPA Tracker
          </h3>

          <p className="mt-1 text-xs text-zinc-400">
            Tracks corrective and preventive actions through verification.
          </p>

          <div className="mt-4 space-y-3">
            {workspace.capaActions.length === 0 ? (
              <p className="rounded-xl border border-zinc-800 bg-black/80 p-4 text-xs text-zinc-500">
                No CAPA action created yet.
              </p>
            ) : (
              workspace.capaActions.map((item) => (
                <CapaCard
                  key={item.id}
                  item={item}
                  onUpdateStatus={
                    onUpdateCapaStatus
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CapaCard({
  item,
  onUpdateStatus,
}: {
  item: CapaAction;
  onUpdateStatus: (
    capaId: string,
    status: CapaStatus
  ) => Promise<void>;
}) {
  const isOverdue =
    item.dueDate &&
    item.status !== "VERIFIED" &&
    new Date(item.dueDate) < new Date();

  return (
    <div className="rounded-xl border border-zinc-800 bg-black/80 p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] text-cyan-400">
              {item.actionType}
            </span>

            <span className="rounded border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-[10px] text-yellow-400">
              {item.priority}
            </span>

            {isOverdue && (
              <span className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] text-red-400">
                OVERDUE
              </span>
            )}
          </div>

          <h4 className="mt-3 text-sm font-bold">
            {item.title}
          </h4>

          <p className="mt-2 text-xs leading-5 text-zinc-400">
            {item.description || "-"}
          </p>

          <div className="mt-3 grid gap-2 text-[11px] text-zinc-500 md:grid-cols-3">
            <span>
              Owner Team: {item.ownerTeam ?? "-"}
            </span>

            <span>
              Owner: {item.ownerName ?? "-"}
            </span>

            <span>
              Due: {item.dueDate ?? "-"}
            </span>
          </div>
        </div>

        <PermissionGuard permission="lessons:update">
          <select
            value={item.status}
            onChange={(e) => {
              void onUpdateStatus(
                item.id,
                e.target.value as CapaStatus
              );
            }}
            className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs outline-none"
          >
            {capaStatuses.map((status) => (
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
  );
}

function Badge({
  children,
  danger = false,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <span
      className={`rounded border px-3 py-1 ${
        danger
          ? "border-red-500/30 bg-red-500/10 text-red-400"
          : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
      }`}
    >
      {children}
    </span>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-zinc-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/80 px-3 py-2 text-xs outline-none focus:border-cyan-600"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-zinc-500">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-1 h-24 w-full rounded-lg border border-zinc-800 bg-black/80 px-3 py-2 text-xs outline-none focus:border-cyan-600"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-zinc-500">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-1 w-full rounded-lg border border-zinc-800 bg-black/80 px-3 py-2 text-xs outline-none focus:border-cyan-600"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}