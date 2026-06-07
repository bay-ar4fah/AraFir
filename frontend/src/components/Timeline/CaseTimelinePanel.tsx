import type {
  TimelineEvent,
} from "../../types/timeline";

import TimelineEventCard from "./TimelineEventCard";

interface Props {
  events: TimelineEvent[];
}

export default function CaseTimelinePanel({
  events,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">
            Investigation Timeline
          </h2>

          <p className="text-zinc-400 text-sm">
            Events extracted from uploaded artifacts.
          </p>
        </div>

        <span className="text-sm text-zinc-400">
          {events.length} events
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-zinc-400">
          No timeline events generated yet.
        </p>
      ) : (
        <div>
          {events.map((event) => (
            <TimelineEventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}
    </div>
  );
}