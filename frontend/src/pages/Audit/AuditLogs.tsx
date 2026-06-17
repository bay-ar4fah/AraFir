import { useEffect, useMemo, useState } from "react";

import type { AuditLog } from "../../types/audit";

import {
  getAuditLogs,
} from "../../services/auditService";

import {
  exportCsv,
} from "../../utils/csvUtils";

export default function AuditLogs() {
  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [actionFilter, setActionFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [actorFilter, setActorFilter] =
    useState("");

  const [caseIdFilter, setCaseIdFilter] =
    useState("");

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

  const uniqueActions = useMemo(() => {
    return Array.from(
      new Set(logs.map((log) => log.action))
    ).sort();
  }, [logs]);

  const uniqueActors = useMemo(() => {
    return Array.from(
      new Set(
        logs
          .map((log) => log.actor_name)
          .filter(Boolean)
      )
    ).sort() as string[];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const searchableText = [
        log.action,
        log.actor_name,
        log.actor_email,
        log.actor_role,
        log.entity_type,
        log.entity_id,
        log.entity_name,
        log.case_id,
        log.message,
        log.metadata,
        log.ip_address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (
        search &&
        !searchableText.includes(search.toLowerCase())
      ) {
        return false;
      }

      if (
        actionFilter &&
        log.action !== actionFilter
      ) {
        return false;
      }

      if (
        statusFilter &&
        log.status !== statusFilter
      ) {
        return false;
      }

      if (
        actorFilter &&
        log.actor_name !== actorFilter
      ) {
        return false;
      }

      if (
        caseIdFilter &&
        !log.case_id
          ?.toLowerCase()
          .includes(caseIdFilter.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [
    logs,
    search,
    actionFilter,
    statusFilter,
    actorFilter,
    caseIdFilter,
  ]);

  function handleExportCsv() {
    exportCsv(
      `arafir-audit-logs-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`,
      filteredLogs.map((log) => ({
        timestamp: log.created_at,
        status: log.status,
        action: log.action,
        actor: log.actor_name,
        actor_email: log.actor_email,
        actor_role: log.actor_role,
        case_id: log.case_id,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        entity_name: log.entity_name,
        message: log.message,
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        metadata: log.metadata,
      }))
    );
  }

  function formatMetadata(metadata: string | null) {
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
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Audit Trail
            </h1>

            <p className="text-zinc-400 text-sm mt-1">
              Enterprise activity monitoring for security, compliance, and DFIR accountability.
            </p>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Filters
        </h2>

        <div className="grid grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search keyword"
            className="bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
          />

          <select
            value={actionFilter}
            onChange={(e) =>
              setActionFilter(e.target.value)
            }
            className="bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
          >
            <option value="">All Actions</option>

            {uniqueActions.map((action) => (
              <option
                key={action}
                value={action}
              >
                {action}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>

          <select
            value={actorFilter}
            onChange={(e) =>
              setActorFilter(e.target.value)
            }
            className="bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
          >
            <option value="">All Actors</option>

            {uniqueActors.map((actor) => (
              <option
                key={actor}
                value={actor}
              >
                {actor}
              </option>
            ))}
          </select>

          <input
            value={caseIdFilter}
            onChange={(e) =>
              setCaseIdFilter(e.target.value)
            }
            placeholder="Case ID"
            className="bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-zinc-400">
          <span>
            Showing {filteredLogs.length} of {logs.length} logs
          </span>

          <button
            onClick={loadLogs}
            className="px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        {isLoading ? (
          <p className="text-zinc-400">
            Loading audit logs...
          </p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-zinc-400">
            No audit logs found.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-black border border-zinc-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
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

                    <p className="text-sm text-zinc-300">
                      {log.message ?? "-"}
                    </p>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-zinc-500">
                      <p>
                        Actor:{" "}
                        <span className="text-zinc-300">
                          {log.actor_name ?? "Unknown"}
                        </span>
                      </p>

                      <p>
                        Role:{" "}
                        <span className="text-zinc-300">
                          {log.actor_role ?? "-"}
                        </span>
                      </p>

                      <p>
                        Case ID:{" "}
                        <span className="font-mono text-zinc-300">
                          {log.case_id ?? "-"}
                        </span>
                      </p>

                      <p>
                        Entity:{" "}
                        <span className="text-zinc-300">
                          {log.entity_type ?? "-"}{" "}
                          {log.entity_name ??
                            log.entity_id ??
                            ""}
                        </span>
                      </p>

                      <p>
                        IP:{" "}
                        <span className="text-zinc-300">
                          {log.ip_address ?? "-"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-zinc-500 min-w-[180px]">
                    {new Date(
                      log.created_at
                    ).toLocaleString()}
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