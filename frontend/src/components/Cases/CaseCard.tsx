import { Link } from "react-router-dom";

import type { Case } from "../../types/case";

import PermissionGuard from "../Auth/PermissionGuard";

interface Props {
  forensicCase: Case;
  onDelete?: () => void | Promise<void>;
}

export default function CaseCard({
  forensicCase,
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