import { useState } from "react";
import type { TimelineEvent } from "../types/timeline";

export function useTimelineFilter(timeline: TimelineEvent[]) {
  const [filter, setFilter] = useState<string>("ALL");

  const filtered = timeline.filter((e) => {
    if (filter === "ALL") return true;
    return (e.type ?? e.eventType) === filter;
  });

  return {
    filter,
    setFilter,
    filtered,
  };
}