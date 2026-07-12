import {
  Activity,
  ArchiveX,
  CalendarClock,
  Database,
  Shield,
} from "lucide-react";

interface CaseMetricCardsProps {
  activeEvidence: number;
  excludedEvidence: number;
  timelineEvents: number;
  mitreFindings: number;
  lastImport?: string;
}

export default function CaseMetricCards({
  activeEvidence,
  excludedEvidence,
  timelineEvents,
  mitreFindings,
  lastImport = "-",
}: CaseMetricCardsProps) {
  const cards = [
    {
      label: "Active Evidence",
      value: activeEvidence,
      suffix: "Items",
      icon: <Database size={21} />,
      tone: "text-cyan-300 bg-cyan-500/10",
    },
    {
      label: "Excluded",
      value: excludedEvidence,
      suffix: "Items",
      icon: <ArchiveX size={21} />,
      tone: "text-emerald-300 bg-emerald-500/10",
    },
    {
      label: "Timeline Events",
      value: timelineEvents,
      suffix: "Events",
      icon: <Activity size={21} />,
      tone: "text-sky-300 bg-sky-500/10",
    },
    {
      label: "MITRE Findings",
      value: mitreFindings,
      suffix: "Findings",
      icon: <Shield size={21} />,
      tone: "text-purple-300 bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/20"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.tone}`}>
              {card.icon}
            </div>

            <div>
              <p className="text-xs text-zinc-500">{card.label}</p>
              <p className="mt-1 text-2xl font-bold text-zinc-50">
                {card.value}
              </p>
              <p className="text-xs text-zinc-500">{card.suffix}</p>
            </div>
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-300">
            <CalendarClock size={21} />
          </div>

          <div>
            <p className="text-xs text-zinc-500">Last Import</p>
            <p className="mt-1 text-xl font-bold text-zinc-50">
              {lastImport}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}