import type {
  CaseAssignmentLog,
} from "../../types/caseAssignment";

interface Props {
  logs: CaseAssignmentLog[];
}

export default function CaseAssignmentHistoryPanel({
  logs,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
      <h2 className="text-xl font-bold">
        Assignment History
      </h2>

      <p className="text-zinc-400 text-sm mt-1 mb-4">
        Investigator assignment and reassignment history.
      </p>

      {logs.length === 0 ? (
        <p className="text-zinc-400 text-sm">
          No assignment history found.
        </p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-black border border-zinc-800 rounded-lg p-4"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      log.action === "ASSIGNED"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                    }`}
                  >
                    {log.action}
                  </span>

                  <p className="mt-3 text-sm">
                    Assigned to{" "}
                    <span className="font-semibold text-cyan-400">
                      {log.assignedToName}
                    </span>{" "}
                    ({log.assignedToRole})
                  </p>

                  <p className="text-xs text-zinc-500 mt-1">
                    By:{" "}
                    {log.assignedByName ??
                      "System"}{" "}
                    {log.assignedByRole
                      ? `(${log.assignedByRole})`
                      : ""}
                  </p>

                  {log.reason && (
                    <p className="text-xs text-zinc-400 mt-2">
                      Reason: {log.reason}
                    </p>
                  )}
                </div>

                <div className="text-xs text-zinc-500 text-right">
                  {new Date(
                    log.createdAt
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}