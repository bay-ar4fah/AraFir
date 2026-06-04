import { useTimeline } from "../../hooks/useTimeline";
import { useTimelineFilter } from "../../hooks/useTimelineFilter";
import TimelineView from "../../components/Timeline/TimelineView";

export default function Timeline() {
  const { timeline } = useTimeline();
  const { filter, setFilter, filtered } =
    useTimelineFilter(timeline);

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-3xl font-bold">
        Attack Timeline
      </h1>

        <div className="text-sm text-zinc-400">
        Active filter: {filter}
      </div>
      
      <div className="flex gap-2">
        {["ALL", "IMPORT", "ANALYZE", "EXPORT"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1 bg-zinc-800 rounded"
          >
            {f}
          </button>
        ))}
      </div>

      {/* TIMELINE */}
      <TimelineView timeline={filtered} />
    </div>
  );
}