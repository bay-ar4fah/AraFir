import type {
  TimelineEvent,
} from "../../types/timeline";

interface Props {
  events: TimelineEvent[];
}

export default function TimelineView({
  events,
}: Props) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
        >
          <div className="text-sm text-zinc-500">
            {new Date(event.timestamp).toLocaleString()}
          </div>

          <div className="font-semibold mt-1">
            ● {event.eventType ?? event.type} ({event.severity})
          </div>

          <div className="text-zinc-400 text-sm mt-1">
            {event.source ?? event.metadata?.filename ?? "-"}
          </div>

          <div className="text-zinc-500 text-xs mt-2">
            {event.description ?? event.user ?? "-"}
          </div>
        </div>
      ))}
    </div>
  );
}