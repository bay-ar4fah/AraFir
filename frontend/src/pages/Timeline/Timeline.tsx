import { useEffect, useMemo, useState } from "react";

import type {
  TimelineEvent,
} from "../../types/timeline";

import {
  getAllTimelineEvents,
} from "../../services/timelineService";

import TimelineView
from "../../components/Timeline/TimelineView";

const severityOptions = [
  "ALL",
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

export default function TimelinePage() {
  const [timeline, setTimeline] =
    useState<TimelineEvent[]>([]);

  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  const [eventTypeFilter, setEventTypeFilter] =
    useState("ALL");

  const [search, setSearch] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState<"NEWEST" | "OLDEST">("NEWEST");

  useEffect(() => {
    getAllTimelineEvents()
      .then(setTimeline)
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const eventTypeOptions = useMemo(() => {
    const types = new Set(
      timeline.map(
        (event) => event.eventType
      )
    );

    return [
      "ALL",
      ...Array.from(types),
    ];
  }, [timeline]);

  const filteredTimeline = useMemo(() => {
    const keyword =
      search.toLowerCase().trim();

    return timeline
      .filter((event) => {
        if (
          severityFilter !== "ALL" &&
          event.severity !== severityFilter
        ) {
          return false;
        }

        if (
          eventTypeFilter !== "ALL" &&
          event.eventType !== eventTypeFilter
        ) {
          return false;
        }

        if (!keyword) {
          return true;
        }

        return (
          event.eventType
            .toLowerCase()
            .includes(keyword) ||
          event.source
            ?.toLowerCase()
            .includes(keyword) ||
          event.description
            ?.toLowerCase()
            .includes(keyword) ||
          event.rawData
            ?.toLowerCase()
            .includes(keyword)
        );
      })
      .sort((a, b) => {
        const left =
          new Date(a.timestamp).getTime();

        const right =
          new Date(b.timestamp).getTime();

        return sortOrder === "NEWEST"
          ? right - left
          : left - right;
      });
  }, [
    timeline,
    severityFilter,
    eventTypeFilter,
    search,
    sortOrder,
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 p-6 space-y-6 text-white">
      <div className="bg-black border border-zinc-800 border-l-4 border-l-cyan-500 rounded-xl p-6">
        <h1 className="text-3xl font-bold">
          Global Timeline Explorer
        </h1>

        <p className="text-zinc-400 mt-2">
          Cross-case timeline events extracted from uploaded artifacts.
        </p>

        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">
              Total Events
            </p>

            <h2 className="text-3xl font-bold">
              {timeline.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">
              Visible Events
            </p>

            <h2 className="text-3xl font-bold text-cyan-400">
              {filteredTimeline.length}
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">
              Critical
            </p>

            <h2 className="text-3xl font-bold text-red-400">
              {
                timeline.filter(
                  (event) =>
                    event.severity === "CRITICAL"
                ).length
              }
            </h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">
              High
            </p>

            <h2 className="text-3xl font-bold text-orange-400">
              {
                timeline.filter(
                  (event) =>
                    event.severity === "HIGH"
                ).length
              }
            </h2>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-zinc-400">
              Search
            </label>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search event, source, raw data..."
              className="mt-2 w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Severity
            </label>

            <select
              value={severityFilter}
              onChange={(e) =>
                setSeverityFilter(e.target.value)
              }
              className="mt-2 w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-sm"
            >
              {severityOptions.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Event Type
            </label>

            <select
              value={eventTypeFilter}
              onChange={(e) =>
                setEventTypeFilter(e.target.value)
              }
              className="mt-2 w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-sm"
            >
              {eventTypeOptions.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-zinc-400">
              Sort
            </label>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(
                  e.target.value as "NEWEST" | "OLDEST"
                )
              }
              className="mt-2 w-full rounded-lg bg-black border border-zinc-800 px-3 py-2 text-sm"
            >
              <option value="NEWEST">
                Newest first
              </option>

              <option value="OLDEST">
                Oldest first
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">
              Timeline Events
            </h2>

            <p className="text-zinc-400 text-sm">
              Showing filtered event records across all cases.
            </p>
          </div>

          <span className="text-sm text-zinc-400">
            {filteredTimeline.length} events
          </span>
        </div>

        <TimelineView
          events={filteredTimeline}
        />
      </div>
    </div>
  );
}