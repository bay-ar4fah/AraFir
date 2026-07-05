import { Link } from "react-router-dom";

import type { Case } from "../../types/case";

import PermissionGuard from "../Auth/PermissionGuard";

import type {
  CaseCardAttributionProjection,
} from "../../types/attributionProjection";

interface Props {
  forensicCase: Case;
  attribution?: CaseCardAttributionProjection;
  onDelete?: () => void;
}

export default function CaseCard({
  forensicCase,
  attribution,
  onDelete,
}: Props) {
  const statusColor =
    forensicCase.status === "OPEN"
      ? "bg-green-500/20 text-green-400"
      : forensicCase.status === "CLOSED"
      ? "bg-zinc-500/20 text-zinc-300"
      : "bg-yellow-500/20 text-yellow-400";

  return (
    <div
      className="
        bg-zinc-900
        border
        border-zinc-800
        rounded-xl
        p-5
        hover:border-cyan-600
        hover:shadow-lg
        hover:shadow-cyan-500/10
        transition
      "
    >
      <Link
        to={`/cases/${forensicCase.id}`}
        className="block"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold">
              {forensicCase.caseName}
            </h2>
            <p className="text-xs text-zinc-500 mt-1 font-mono break-all">
                ID: {forensicCase.id}
              </p>

            <p className="text-sm text-zinc-400 mt-1">
              {forensicCase.description}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColor}`}
          >
            {forensicCase.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
          <div>
            <p className="text-zinc-500">
              Investigator
            </p>

            <p>
              {forensicCase.investigator}
            </p>
          </div>

          <div>
            <p className="text-zinc-500">
              Created
            </p>

            <p>
              {new Date(
                forensicCase.createdAt
              ).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <span className="text-cyan-400 text-sm font-medium">
            Open Investigation →
          </span>
        </div>
      </Link>
      <div className="mt-4 rounded-xl border border-zinc-800 bg-black/50 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-zinc-500">
              Threat Actor
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-zinc-100">
              {attribution?.threatActor ??
                "Unknown Actor"}
            </p>
          </div>

          <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-400">
            {attribution?.confidence ?? "UNKNOWN"}
          </span>
        </div>

        <p className="mt-2 truncate text-xs text-zinc-500">
          Campaign:{" "}
          {attribution?.campaignName ??
            "Unassigned"}
        </p>
      </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-400">
            {forensicCase.investigationType?.replaceAll(
              "_",
              " "
            ) ?? "MULTI SOURCE"}
          </span>

          <span className="rounded border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-[10px] font-semibold text-yellow-400">
            {forensicCase.priority ?? "MEDIUM"}
          </span>

          <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-[10px] font-semibold text-purple-400">
            {forensicCase.classification ?? "INTERNAL"}
          </span>
        </div>

      <div className="flex justify-end mt-4">
        <PermissionGuard permission="case:delete">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              void onDelete?.();
            }}
            className="
              px-3
              py-2
              rounded-lg
              border
              border-red-500/30
              text-red-400
              hover:bg-red-500/10
              text-sm
            "
          >
            Delete
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
}