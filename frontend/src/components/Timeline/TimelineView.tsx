import type { TimelineEvent } from "../../types/timeline";

const severityColor = {
  CRITICAL: "text-red-500",
  HIGH: "text-orange-400",
  MEDIUM: "text-yellow-400",
  LOW: "text-green-400",
};

export default function TimelineView({
  timeline,
}: {
  timeline: TimelineEvent[];
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">
        Advanced Forensic Timeline
      </h2>

      <div className="space-y-4">
        {timeline.map((event) => (
          <div
            key={event.id}
            className="flex items-start justify-between border-b border-zinc-800 pb-3"
          >
            {/* LEFT */}
            <div>
              <div className={`font-bold ${severityColor[event.severity]}`}>
                ● {event.type} ({event.severity})
              </div>

              <div className="text-zinc-300 text-sm">
                {event.metadata?.filename}
              </div>

              <div className="text-zinc-500 text-xs">
                Evidence: {event.evidenceId}
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right text-xs text-zinc-500">
              <div>{event.user}</div>
              <div>{event.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}