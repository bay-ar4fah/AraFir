import {
  Copy,
  FileText,
  GitBranch,
} from "lucide-react";

interface CaseWorkspaceHeaderProps {
  caseId: string;
  caseName: string;
  description?: string;
  status?: string;
  onCopyCaseId: () => void;
  onViewAttackGraph: () => void;
  onGenerateReport?: () => void;
}

export default function CaseWorkspaceHeader({
  caseId,
  caseName,
  description,
  status = "OPEN",
  onCopyCaseId,
  onViewAttackGraph,
  onGenerateReport,
}: CaseWorkspaceHeaderProps) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
          <span className="text-cyan-400">Cases</span>
          <span>/</span>
          <span>{caseName}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
            {caseName}
          </h1>

          <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
            {status}
          </span>
        </div>

        <p className="mt-3 max-w-3xl text-sm text-zinc-400">
          {description || "No case description available."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">Case ID</span>

          <button
            type="button"
            onClick={onCopyCaseId}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-xs text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300"
          >
            {caseId}
            <Copy size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onCopyCaseId}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
        >
          <Copy size={17} />
          Copy ID
        </button>

        <button
          type="button"
          onClick={onViewAttackGraph}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400"
        >
          <GitBranch size={17} />
          View Attack Graph
        </button>

        <button
          type="button"
          onClick={onGenerateReport}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-semibold text-zinc-300 hover:bg-zinc-900"
        >
          <FileText size={17} />
          Generate Report
        </button>
      </div>
    </div>
  );
}