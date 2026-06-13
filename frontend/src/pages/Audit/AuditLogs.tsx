import {
  useEffect,
  useState,
} from "react";

import type {
  AuditLog,
} from "../../types/audit";

import {
  getAuditLogs,
} from "../../services/auditService";

export default function AuditLogs() {
  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  async function loadLogs() {
    try {
      setIsLoading(true);

      const data = await getAuditLogs();

      setLogs(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function formatMetadata(
    metadata: string | null
  ) {
    if (!metadata) return null;

    try {
      return JSON.stringify(
        JSON.parse(metadata),
        null,
        2
      );
    } catch {
      return metadata;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white space-y-6">
      <div className="bg-black border border-zinc-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold">
          Audit Trail
        </h1>

        <p className="text-zinc-400 text-sm mt-1">
          Immutable activity history across AraFir platform.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Recent Activity
          </h2>

          <button
            onClick={loadLogs}
            className="px-3 py-1 rounded border border-zinc-700 text-sm hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>

        {isLoading ? (
          <p className="text-zinc-400">
            Loading audit logs...
          </p>
        ) : logs.length === 0 ? (
          <p className="text-zinc-400">
            No audit logs found.
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
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          log.status === "SUCCESS"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {log.status}
                      </span>

                      <span className="font-semibold text-cyan-400">
                        {log.action}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-300 mt-2">
                      {log.message ?? "-"}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      Actor:{" "}
                      {log.actor_name ?? "Unknown"}{" "}
                      {log.actor_role
                        ? `(${log.actor_role})`
                        : ""}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      Entity:{" "}
                      {log.entity_type ?? "-"}{" "}
                      {log.entity_name ??
                        log.entity_id ??
                        ""}
                    </p>
                  </div>

                  <div className="text-right text-xs text-zinc-500">
                    <p>
                      {new Date(
                        log.created_at
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1">
                      IP: {log.ip_address ?? "-"}
                    </p>
                  </div>
                </div>

                {log.metadata && (
                  <pre className="mt-3 bg-zinc-950 border border-zinc-800 rounded p-3 text-xs text-zinc-400 overflow-auto">
                    {formatMetadata(log.metadata)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}