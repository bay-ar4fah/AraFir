import type {
  CustodyLog,
} from "../../types/custody";

interface Props {
  logs: CustodyLog[];
}

function actionStyle(action: string) {
  if (action === "EXCLUDE") {
    return "text-red-400 bg-red-500/10 border-red-500/30";
  }

  if (action === "RESTORE") {
    return "text-green-400 bg-green-500/10 border-green-500/30";
  }

  if (action === "MITRE_MAPPED") {
    return "text-orange-400 bg-orange-500/10 border-orange-500/30";
  }

  if (action === "ANALYZE") {
    return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
  }

  return "text-zinc-300 bg-zinc-800 border-zinc-700";
}

export default function CaseCustodyPanel({
  logs,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">
            Chain of Custody
          </h2>

          <p className="text-zinc-400 text-sm">
            Audit trail of evidence and case actions.
          </p>
        </div>

        <span className="text-sm text-zinc-400">
          {logs.length} logs
        </span>
      </div>

      {logs.length === 0 ? (
        <p className="text-zinc-400">
          No custody logs available.
        </p>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-black border border-zinc-800 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`
                      inline-block
                      px-2
                      py-1
                      rounded-md
                      border
                      text-xs
                      font-semibold
                      ${actionStyle(log.action)}
                    `}
                  >
                    {log.action}
                  </span>

                  <p className="text-sm text-zinc-300 mt-3">
                    User: {log.user}
                  </p>

                  {log.reason && (
                    <p className="text-sm text-zinc-400 mt-1">
                      Reason: {log.reason}
                    </p>
                  )}

                  {log.evidenceId && (
                    <p className="text-xs text-zinc-500 mt-1 break-all">
                      Evidence ID: {log.evidenceId}
                    </p>
                  )}
                </div>

                <p className="text-xs text-zinc-500">
                  {new Date(
                    log.timestamp
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}