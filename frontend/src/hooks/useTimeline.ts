import { useEffect, useState } from "react";
import type { TimelineEvent } from "../types/timeline";
import { buildTimeline } from "../services/timelineService";

export function useTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  const refresh = async () => {
    const data = await buildTimeline();
    setTimeline(data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { timeline, refresh };
}