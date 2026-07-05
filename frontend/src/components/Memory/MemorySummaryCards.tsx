import type { MemorySummary } from "../../types/memory";

interface MemorySummaryCardsProps {
  summary: MemorySummary;
}

export default function MemorySummaryCards({
  summary,
}: MemorySummaryCardsProps) {
  const cards = [
    {
      label: "Total Artifacts",
      value: summary.totalArtifacts,
    },
    {
      label: "Processes",
      value: summary.processCount,
    },
    {
      label: "Network Connections",
      value: summary.networkCount,
    },
    {
      label: "Suspicious",
      value: summary.suspiciousCount,
    },
    {
      label: "Critical",
      value: summary.criticalCount,
    },
    {
      label: "Promoted Findings",
      value: summary.promotedFindings,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
        >
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {card.label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-zinc-100">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}