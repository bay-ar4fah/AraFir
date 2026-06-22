import {
  useMemo,
  useState,
} from "react";

import type {
  CaseActivityItem,
  CaseActivitySource,
} from "../../types/caseActivity";

interface Props {
  activities: CaseActivityItem[];
}

const SOURCE_BADGE: Record<
  CaseActivitySource,
  string
> = {
  AUDIT:
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  CUSTODY:
    "bg-purple-500/10 text-purple-400 border-purple-500/30",
  ASSIGNMENT:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  TIMELINE:
    "bg-green-500/10 text-green-400 border-green-500/30",
};

export default function CaseActivityPanel({
  activities,
}: Props) {
  const [sourceFilter, setSourceFilter] =
    useState<CaseActivitySource | "ALL">(
      "ALL"
    );

  const [search, setSearch] =
    useState("");

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (
        sourceFilter !== "ALL" &&
        activity.source !== sourceFilter
      ) {
        return false;
      }

      const searchableText = [
        activity.source,
        activity.action,
        activity.actorName,
        activity.actorRole,
        activity.entityType,
        activity.entityId,
        activity.entityName,
        activity.message,
        activity.reason,
        activity.metadata,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (
        search &&
        !searchableText.includes(
          search.toLowerCase()
        )
      ) {
        return false;
      }

      return true;
    });
  }, [activities, sourceFilter, search]);

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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold">
            Case Activity Timeline
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            Unified activity stream from audit logs,
            custody events, assignment history, and
            forensic timeline events.
          </p>
        </div>

        <span className="text-sm text-zinc-400">
          {filteredActivities.length} events
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search activity"
          className="bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
        />

        <select
          value={sourceFilter}
          onChange={(e) =>
            setSourceFilter(
              e.target.value as
                | CaseActivitySource
                | "ALL"
            )
          }
          className="bg-black border border-zinc-700 rounded px-3 py-2 text-sm"
        >
          <option value="ALL">
            All Sources
          </option>

          <option value="AUDIT">
            Audit
          </option>

          <option value="CUSTODY">
            Custody
          </option>

          <option value="ASSIGNMENT">
            Assignment
          </option>

          <option value="TIMELINE">
            Timeline
          </option>
        </select>
      </div>

      {filteredActivities.length === 0 ? (
        <p className="text-zinc-400 text-sm">
          No case activity found.
        </p>
      ) : (
        <div className="relative space-y-4">
          {filteredActivities.map(
            (activity) => (
              <div
                key={`${activity.source}-${activity.id}`}
                className="bg-black border border-zinc-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded border text-xs ${
                          SOURCE_BADGE[
                            activity.source
                          ]
                        }`}
                      >
                        {activity.source}
                      </span>

                      <span className="font-semibold text-cyan-400 text-sm">
                        {activity.action}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-300 mt-3">
                      {activity.message ||
                        activity.reason ||
                        "-"}
                    </p>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3 text-xs text-zinc-500">
                      <p>
                        Actor:{" "}
                        <span className="text-zinc-300">
                          {activity.actorName ??
                            "System"}
                        </span>
                      </p>

                      <p>
                        Role:{" "}
                        <span className="text-zinc-300">
                          {activity.actorRole ??
                            "-"}
                        </span>
                      </p>

                      <p>
                        Entity:{" "}
                        <span className="text-zinc-300">
                          {activity.entityType ??
                            "-"}{" "}
                          {activity.entityName ||
                            activity.entityId ||
                            ""}
                        </span>
                      </p>

                      <p>
                        Time:{" "}
                        <span className="text-zinc-300">
                          {new Date(
                            activity.timestamp
                          ).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {activity.metadata && (
                      <pre className="mt-3 bg-zinc-950 border border-zinc-800 rounded p-3 text-xs text-zinc-400 overflow-auto">
                        {formatMetadata(
                          activity.metadata
                        )}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}