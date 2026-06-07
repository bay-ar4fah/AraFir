import { useMemo, useState } from "react";

import type {
  TimelineEvent,
} from "../../types/timeline";

import SeverityBadge from "./SeverityBadge";

interface Props {
  event: TimelineEvent;
}

export default function TimelineEventCard({
  event,
}: Props) {
  const [isOpen, setIsOpen] =
    useState(false);

  const parsedRaw = useMemo(() => {
    try {
      return event.rawData
        ? JSON.parse(event.rawData)
        : null;
    } catch {
      return null;
    }
  }, [event.rawData]);

  return (
    <div className="relative pl-6 pb-6 border-l border-zinc-800">
      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-500" />

      <div className="bg-black border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">
              {new Date(
                event.timestamp
              ).toLocaleString()}
            </p>

            <h3 className="font-bold mt-1">
              {event.eventType}
            </h3>

            <p className="text-sm text-zinc-400 mt-1">
              {event.description}
            </p>
          </div>

          <SeverityBadge
            severity={event.severity}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-zinc-500">
          <div>
            Source: {event.source}
          </div>

          <div>
            Evidence ID: {event.evidenceId}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mt-4 text-xs text-cyan-400 hover:text-cyan-300"
        >
          {isOpen
            ? "Hide Raw Event"
            : "View Raw Event"}
        </button>

        {isOpen && (
          <pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-xs text-zinc-300">
            {JSON.stringify(
              parsedRaw ?? event.rawData,
              null,
              2
            )}
          </pre>
        )}
      </div>
    </div>
  );
}