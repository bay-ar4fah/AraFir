import type {
  Case,
} from "../../types/case";

import PermissionGuard from "../Auth/PermissionGuard";

interface Props {
  forensicCase: Case;
  onReassignClick: () => void;
}

export default function CaseAssignmentPanel({
  forensicCase,
  onReassignClick,
}: Props) {
  const investigatorName =
    forensicCase.investigatorName ||
    forensicCase.investigator ||
    "Unassigned";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">
            Case Assignment
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            Current responsibility and assignment ownership.
          </p>
        </div>

        <PermissionGuard permission="case:assign">
          <button
            onClick={onReassignClick}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-sm"
          >
            Reassign
          </button>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 text-sm">
        <div>
          <p className="text-zinc-500">
            Case ID
          </p>

          <p className="font-mono text-xs text-zinc-300 break-all">
            {forensicCase.id}
          </p>
        </div>
        <div>
          <p className="text-zinc-500">
            Assigned Investigator
          </p>

          <p className="font-medium text-white">
            {investigatorName}
          </p>
        </div>

        <div>
          <p className="text-zinc-500">
            Assigned By
          </p>

          <p className="font-medium text-white">
            {forensicCase.assignedByName ??
              "-"}
          </p>
        </div>

        <div>
          <p className="text-zinc-500">
            Assigned At
          </p>

          <p className="font-medium text-white">
            {forensicCase.assignedAt
              ? new Date(
                  forensicCase.assignedAt
                ).toLocaleString()
              : "-"}
          </p>
        </div>
      </div>
    </div>
  );
}