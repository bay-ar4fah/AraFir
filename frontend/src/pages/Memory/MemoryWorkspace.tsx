import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock3,
  Database,
  FileSearch,
  HardDrive,
  Network,
  Shield,
  Upload,
} from "lucide-react";

import type {
  Case,
} from "../../types/case";

import type {
  Evidence,
} from "../../types/evidence";

import {
  getCaseById,
} from "../../services/caseService";

import {
  getEvidenceByCaseId,
} from "../../services/evidenceService";

import {
  uploadArtifact,
} from "../../services/artifactService";

import {
  formatFileSize,
} from "../../utils/fileUtils";

import EvidenceStatusBadge from "../../components/Evidence/EvidenceStatusBadge";

const MEMORY_EXTENSIONS = [
  ".raw",
  ".mem",
  ".vmem",
  ".dmp",
  ".lime",
];

function isMemoryDumpFile(filename: string) {
  const lower = filename.toLowerCase();

  return MEMORY_EXTENSIONS.some((extension) =>
    lower.endsWith(extension)
  );
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

export default function MemoryWorkspace() {
  const { caseId } =
    useParams<{ caseId: string }>();

  const [caseData, setCaseData] =
    useState<Case | null>(null);

  const [evidence, setEvidence] =
    useState<Evidence[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUploading, setIsUploading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const memoryEvidence = useMemo(() => {
    return evidence.filter((item) =>
      isMemoryDumpFile(item.filename)
    );
  }, [evidence]);

  const activeMemoryEvidence = useMemo(() => {
    return memoryEvidence.filter(
      (item) => item.status !== "EXCLUDED"
    );
  }, [memoryEvidence]);

  const totalMemorySize = useMemo(() => {
    return activeMemoryEvidence.reduce(
      (total, item) => total + item.size,
      0
    );
  }, [activeMemoryEvidence]);

  const lastImported = useMemo(() => {
    if (memoryEvidence.length === 0) {
      return null;
    }

    const latestTimestamp = memoryEvidence
      .map((item) =>
        new Date(item.importedAt).getTime()
      )
      .filter((timestamp) =>
        !Number.isNaN(timestamp)
      )
      .sort((a, b) => b - a)[0];

    if (!latestTimestamp) {
      return null;
    }

    return new Date(latestTimestamp).toISOString();
  }, [memoryEvidence]);

  const loadWorkspace = async () => {
    if (!caseId) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [caseResult, evidenceResult] =
        await Promise.all([
          getCaseById(caseId),
          getEvidenceByCaseId(caseId),
        ]);

      setCaseData(caseResult);
      setEvidence(evidenceResult);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Failed to load memory workspace."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspace();
  }, [caseId]);

  const handleMemoryDumpUpload = async (
    files: FileList
  ) => {
    if (!caseId) return;

    const selectedFiles =
      Array.from(files);

    const invalidFiles =
      selectedFiles.filter(
        (file) =>
          !isMemoryDumpFile(file.name)
      );

    if (invalidFiles.length > 0) {
      alert(
        `Invalid memory dump extension: ${invalidFiles
          .map((file) => file.name)
          .join(", ")}. Allowed: ${MEMORY_EXTENSIONS.join(
          ", "
        )}`
      );
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage("");

      for (const file of selectedFiles) {
        await uploadArtifact(caseId, file);
      }

      await loadWorkspace();

      alert(
        "Memory dump evidence imported successfully."
      );
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Failed to import memory dump. Check backend upload limit, allowed extensions, and artifact API logs."
      );
      alert("Failed to import memory dump");
    } finally {
      setIsUploading(false);
    }
  };

  if (!caseId) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-sm text-red-400">
        Invalid case ID.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-sm text-zinc-400">
        Loading memory workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <section className="border-b border-zinc-800 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_34%),linear-gradient(180deg,rgba(9,9,11,1),rgba(24,24,27,0.72))]">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-xs text-zinc-500">
                <Link
                  to="/cases"
                  className="font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Cases
                </Link>

                <span>/</span>

                <Link
                  to={`/cases/${caseId}`}
                  className="font-medium text-cyan-400 hover:text-cyan-300"
                >
                  {caseData?.caseName || caseId}
                </Link>

                <span>/</span>

                <span>Memory Forensics</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300">
                  <Brain size={30} />
                </div>

                <div>
                  <h1 className="text-3xl font-black tracking-tight text-zinc-50 md:text-4xl">
                    Memory Forensics Workspace
                  </h1>

                  <p className="mt-2 text-sm text-zinc-400">
                    Case-linked workspace for RAM dump triage, memory evidence,
                    suspicious process review, injected code, and forensic
                    reconstruction.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-500">
                  Case ID
                </span>

                <span className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-[11px] text-zinc-300">
                  {caseId}
                </span>

                <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  {caseData?.status || "OPEN"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/cases/${caseId}`}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900"
              >
                Back to Case
              </Link>

              <label
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${
                  isUploading
                    ? "cursor-not-allowed bg-zinc-700 text-zinc-400"
                    : "cursor-pointer bg-cyan-500 text-zinc-950 hover:bg-cyan-400"
                }`}
              >
                <Upload size={17} />
                {isUploading
                  ? "Importing..."
                  : "Import Memory Dump"}

                <input
                  type="file"
                  multiple
                  disabled={isUploading}
                  accept=".raw,.mem,.vmem,.dmp,.lime"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files) {
                      handleMemoryDumpUpload(
                        event.target.files
                      );
                    }

                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {errorMessage}
            </div>
          )}

          <MemorySummaryCards
            totalEvidence={memoryEvidence.length}
            activeEvidence={activeMemoryEvidence.length}
            totalSize={totalMemorySize}
            lastImported={lastImported}
          />
        </div>
      </section>

      <main className="mx-auto grid max-w-[1600px] gap-6 p-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)]">
        <div className="space-y-6">
          <MemoryEvidenceTable
            evidence={memoryEvidence}
          />

          <MemoryAnalysisModules
            caseId={caseId}
            memoryEvidenceCount={
              activeMemoryEvidence.length
            }
          />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <MemoryCaseContextCard
            caseData={caseData}
            lastImported={lastImported}
          />

          <MemoryReadinessCard
            memoryEvidenceCount={
              activeMemoryEvidence.length
            }
          />
        </aside>
      </main>
    </div>
  );
}

function MemorySummaryCards({
  totalEvidence,
  activeEvidence,
  totalSize,
  lastImported,
}: {
  totalEvidence: number;
  activeEvidence: number;
  totalSize: number;
  lastImported: string | null;
}) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={<Database size={21} />}
        label="Memory Evidence"
        value={totalEvidence}
        subValue={`${activeEvidence} active`}
        tone="cyan"
      />

      <SummaryCard
        icon={<HardDrive size={21} />}
        label="Memory Size"
        value={formatFileSize(totalSize)}
        subValue="Active dump size"
        tone="purple"
      />

      <SummaryCard
        icon={<CheckCircle2 size={21} />}
        label="Integrity"
        value="Tracked"
        subValue="SHA256 from evidence"
        tone="green"
      />

      <SummaryCard
        icon={<Clock3 size={21} />}
        label="Last Import"
        value={formatDateOnly(lastImported)}
        subValue={formatDateTime(lastImported)}
        tone="yellow"
      />
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  subValue,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue: string;
  tone: "cyan" | "purple" | "green" | "yellow";
}) {
  const toneClass = {
    cyan: "bg-cyan-500/10 text-cyan-300",
    purple: "bg-purple-500/10 text-purple-300",
    green: "bg-emerald-500/10 text-emerald-300",
    yellow: "bg-yellow-500/10 text-yellow-300",
  }[tone];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/20">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClass}`}>
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-zinc-500">
            {label}
          </p>

          <p className="mt-1 truncate text-2xl font-bold text-zinc-50">
            {value}
          </p>

          <p className="truncate text-xs text-zinc-500">
            {subValue}
          </p>
        </div>
      </div>
    </div>
  );
}

function MemoryEvidenceTable({
  evidence,
}: {
  evidence: Evidence[];
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center gap-3">
        <HardDrive
          size={22}
          className="text-cyan-300"
        />

        <div>
          <h2 className="text-lg font-bold text-zinc-100">
            Memory Dump Evidence
          </h2>

          <p className="text-xs text-zinc-500">
            RAM dump files linked to this case. Supported formats:
            .raw, .mem, .vmem, .dmp, .lime.
          </p>
        </div>
      </div>

      {evidence.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-400">
          No memory dump evidence found. Import a memory dump to start
          analysis.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[920px] text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">
                  Filename
                </th>
                <th className="px-4 py-3 font-medium">
                  Type
                </th>
                <th className="px-4 py-3 font-medium">
                  Size
                </th>
                <th className="px-4 py-3 font-medium">
                  SHA256
                </th>
                <th className="px-4 py-3 font-medium">
                  Imported By
                </th>
                <th className="px-4 py-3 font-medium">
                  Imported At
                </th>
                <th className="px-4 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800 bg-zinc-950/70">
              {evidence.map((item) => (
                <tr key={item.id}>
                  <td className="max-w-[240px] truncate px-4 py-3 font-semibold text-zinc-100">
                    {item.filename}
                  </td>

                  <td className="px-4 py-3 font-semibold text-cyan-300">
                    {item.fileType}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {formatFileSize(item.size)}
                  </td>

                  <td
                    className="max-w-[260px] truncate px-4 py-3 font-mono text-[11px] text-zinc-500"
                    title={item.sha256}
                  >
                    {item.sha256}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {item.importedBy}
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

function MemoryAnalysisModules({
  caseId,
  memoryEvidenceCount,
}: {
  caseId: string;
  memoryEvidenceCount: number;
}) {
  const modules = [
    {
      icon: <Activity size={22} />,
      title: "Process Analysis",
      description:
        "Review pslist, pstree, command line, parent-child process relationships, and suspicious execution paths.",
      status:
        memoryEvidenceCount > 0 ? "READY" : "WAITING",
    },
    {
      icon: <Network size={22} />,
      title: "Network From Memory",
      description:
        "Map sockets, connections, listening ports, and network indicators extracted from memory.",
      status:
        memoryEvidenceCount > 0 ? "READY" : "WAITING",
    },
    {
      icon: <Shield size={22} />,
      title: "Malfind / Injection",
      description:
        "Track suspicious VAD, injected process, hidden payload, or memory-resident malware indicators.",
      status:
        memoryEvidenceCount > 0 ? "READY" : "WAITING",
    },
    {
      icon: <FileSearch size={22} />,
      title: "YARA Memory Scan",
      description:
        "Store YARA hit metadata and link suspicious memory sections to findings.",
      status:
        memoryEvidenceCount > 0 ? "READY" : "WAITING",
    },
  ];

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Brain
            size={22}
            className="text-purple-300"
          />

          <div>
            <h2 className="text-lg font-bold text-zinc-100">
              Memory Analysis Modules
            </h2>

            <p className="text-xs text-zinc-500">
              Case ID: {caseId}
            </p>
          </div>
        </div>

        <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-300">
          Phase 4.3
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <div
            key={module.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-300">
                  {module.icon}
                </div>

                <h3 className="font-bold text-zinc-100">
                  {module.title}
                </h3>
              </div>

              <span
                className={`rounded-full border px-2 py-1 text-[10px] font-bold ${
                  module.status === "READY"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-zinc-700 bg-zinc-900 text-zinc-500"
                }`}
              >
                {module.status}
              </span>
            </div>

            <p className="text-xs leading-5 text-zinc-500">
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MemoryCaseContextCard({
  caseData,
  lastImported,
}: {
  caseData: Case | null;
  lastImported: string | null;
}) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <h2 className="text-lg font-bold text-zinc-100">
        Case Context
      </h2>

      <div className="mt-5 space-y-4 text-sm">
        <ContextRow
          label="Case Name"
          value={caseData?.caseName ?? "-"}
        />

        <ContextRow
          label="Investigator"
          value={
            caseData?.investigatorName ||
            caseData?.investigator ||
            "-"
          }
        />

        <ContextRow
          label="Status"
          value={caseData?.status ?? "-"}
          accent="green"
        />

        <ContextRow
          label="Type"
          value={
            caseData?.investigationType
              ? caseData.investigationType.replaceAll(
                  "_",
                  " "
                )
              : "MEMORY FORENSICS"
          }
        />

        <ContextRow
          label="Priority"
          value={caseData?.priority ?? "MEDIUM"}
          accent="yellow"
        />

        <ContextRow
          label="Last Memory Import"
          value={formatDateTime(lastImported)}
        />
      </div>
    </section>
  );
}

function ContextRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "green" | "yellow";
}) {
  const className =
    accent === "green"
      ? "text-emerald-300"
      : accent === "yellow"
      ? "text-yellow-300"
      : "text-zinc-100";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-3">
      <span className="text-zinc-500">
        {label}
      </span>

      <span
        className={`max-w-[220px] truncate text-right font-semibold ${className}`}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}

function MemoryReadinessCard({
  memoryEvidenceCount,
}: {
  memoryEvidenceCount: number;
}) {
  const isReady = memoryEvidenceCount > 0;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="flex items-center gap-3">
        <AlertTriangle
          size={22}
          className={
            isReady
              ? "text-emerald-300"
              : "text-yellow-300"
          }
        />

        <h2 className="text-lg font-bold text-zinc-100">
          Analysis Readiness
        </h2>
      </div>

      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <p
          className={`text-sm font-bold ${
            isReady
              ? "text-emerald-300"
              : "text-yellow-300"
          }`}
        >
          {isReady
            ? "Memory evidence is ready for analysis."
            : "Waiting for memory dump evidence."}
        </p>

        <p className="mt-2 text-xs leading-5 text-zinc-500">
          {isReady
            ? "You can proceed with process review, network artifact mapping, malfind triage, and YARA result documentation."
            : "Import a .raw, .mem, .vmem, .dmp, or .lime file to activate memory analysis modules."}
        </p>
      </div>
    </section>
  );
}