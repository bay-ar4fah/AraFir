import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  BriefcaseBusiness,
  FolderSearch,
  Target,
  ShieldAlert,
  Skull,
  BookOpen,
} from "lucide-react";

import type {
  InvestigationDashboard,
  DashboardFindingItem,
  DashboardTimelineItem,
  DashboardCaseItem,
  DashboardAttributionItem,
  DashboardLessonsPendingItem,
} from "../../types/dashboard";

import {
  getInvestigationDashboard,
} from "../../services/dashboardService";

export default function Dashboard() {
  const [data, setData] =
    useState<InvestigationDashboard | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(false);

  async function loadDashboard() {
    try {
      setIsLoading(true);

      const result =
        await getInvestigationDashboard();

      setData(result);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const evidenceTotal =
    data?.evidenceProcessing.imported ?? 0;

  const analysisPercent = useMemo(() => {
    if (!data || evidenceTotal === 0) {
      return 0;
    }

    return Math.round(
      (data.evidenceProcessing.analyzed /
        evidenceTotal) *
        100
    );
  }, [data, evidenceTotal]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-zinc-400">
        Loading investigation dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-zinc-400">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Investigation Command Center
        </h1>

        <p className="mt-1 text-zinc-400">
          Overview of investigations, findings, evidence, and attack timeline intelligence.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard
          icon={<BriefcaseBusiness size={28} />}
          title="Open Cases"
          value={data.metrics.openCases}
          accent="cyan"
          subtitle="Active forensic investigations"
        />

        <MetricCard
          icon={<ShieldAlert size={28} />}
          title="Active Findings"
          value={data.metrics.activeFindings}
          accent="purple"
          subtitle="MITRE and forensic findings"
        />

        <MetricCard
          icon={<FolderSearch size={28} />}
          title="Evidence Items"
          value={data.metrics.evidenceItems}
          accent="emerald"
          subtitle="Imported forensic artifacts"
        />

        <MetricCard
          icon={<Target size={28} />}
          title="Attribution Models"
          value={data.metrics.attributionModels}
          accent="orange"
          subtitle="Candidate actor profiles"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr_1.1fr]">
        <Panel
          title="Active Investigations"
          actionLabel="View all cases"
          actionPath="/cases"
        >
          <div className="space-y-3">
            {data.activeInvestigations.length === 0 ? (
              <EmptyState text="No active investigations found." />
            ) : (
              data.activeInvestigations.map(
                (item) => (
                  <ActiveInvestigationCard
                    key={item.id}
                    item={item}
                  />
                )
              )
            )}
          </div>
        </Panel>

        <Panel
          title="Recent Findings"
          actionLabel="View MITRE"
          actionPath="/mitre"
        >
          <div className="space-y-3">
            {data.recentFindings.length === 0 ? (
              <EmptyState text="No findings available yet." />
            ) : (
              data.recentFindings.map(
                (item) => (
                  <FindingRow
                    key={item.id}
                    item={item}
                  />
                )
              )
            )}
          </div>
        </Panel>

        <Panel
          title="Attack Timeline Intelligence"
          actionLabel="View timeline"
          actionPath="/timeline"
        >
          <div className="space-y-4">
            {data.attackTimeline.length === 0 ? (
              <EmptyState text="No timeline events available yet." />
            ) : (
              data.attackTimeline.map(
                (item) => (
                  <TimelineIntelRow
                    key={item.id}
                    item={item}
                  />
                )
              )
            )}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_1fr_1fr]">
        <Panel
          title="MITRE ATT&CK Heatmap"
          actionLabel="View MITRE"
          actionPath="/mitre"
        >
          <MitreHeatmap
            items={data.mitreHeatmap}
          />
        </Panel>

        <Panel
          title="Attribution Summary"
          actionLabel="View workspace"
          actionPath="/cases"
        >
          <AttributionSummary
            items={data.attributionSummary}
          />
        </Panel>

        <Panel
          title="Evidence Processing Status"
          actionLabel="View evidence"
          actionPath="/evidence"
        >
          <EvidenceProcessing
            processing={data.evidenceProcessing}
            percent={analysisPercent}
          />
        </Panel>

        <Panel
          title="Lessons Learned Pending"
          actionLabel="View cases"
          actionPath="/cases"
        >
          <LessonsPending
            items={data.lessonsPending}
          />
        </Panel>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  accent:
    | "cyan"
    | "purple"
    | "emerald"
    | "orange";
}) {
  const accentClass = {
    cyan:
      "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    purple:
      "bg-purple-500/10 text-purple-400 border-purple-500/20",
    emerald:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    orange:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",
  }[accent];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg shadow-black/20">
      <div className="flex items-center gap-4">
        <div
          className={`h-14 w-14 rounded-2xl border flex items-center justify-center ${accentClass}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm text-zinc-400">
            {title}
          </p>

          <h2 className="text-4xl font-bold">
            {value}
          </h2>

          <p className="text-xs text-zinc-500">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function Panel({
  title,
  actionLabel,
  actionPath,
  children,
}: {
  title: string;
  actionLabel?: string;
  actionPath?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold">
          {title}
        </h2>

        {actionLabel && actionPath && (
          <Link
            to={actionPath}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
          >
            {actionLabel} →
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}

function ActiveInvestigationCard({
  item,
}: {
  item: DashboardCaseItem;
}) {
  return (
    <Link
      to={`/cases/${item.id}`}
      className="block rounded-xl border border-zinc-800 bg-black p-4 transition hover:border-cyan-600"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">
            {item.caseName}
          </p>

          <p className="mt-1 font-mono text-xs text-zinc-500">
            ID: {item.id}
          </p>
        </div>

        <span className="rounded bg-green-500/10 px-2 py-1 text-xs text-green-400">
          {item.status ?? "OPEN"}
        </span>
      </div>

      <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
        {item.description ?? "-"}
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <InfoCell
          label="Investigator"
          value={item.investigator ?? "-"}
        />

        <InfoCell
          label="Evidence"
          value={String(item.evidenceCount)}
        />

        <InfoCell
          label="Findings"
          value={String(item.findingCount)}
        />
      </div>
    </Link>
  );
}

function FindingRow({
  item,
}: {
  item: DashboardFindingItem;
}) {
  return (
    <Link
      to={item.caseId ? `/cases/${item.caseId}` : "/mitre"}
      className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black p-4 transition hover:border-purple-500/50"
    >
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
        <Skull size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold">
            {item.title}
          </p>

          <SeverityBadge
            severity={item.severity}
          />
        </div>

        <p className="mt-1 text-xs text-zinc-500">
          Case: {item.caseName ?? "-"} · Source:{" "}
          {item.source ?? "-"}
        </p>
      </div>
    </Link>
  );
}

function TimelineIntelRow({
  item,
}: {
  item: DashboardTimelineItem;
}) {
  return (
    <Link
      to={item.caseId ? `/cases/${item.caseId}` : "/timeline"}
      className="relative block rounded-xl border border-zinc-800 bg-black p-4 pl-5 transition hover:border-cyan-600"
    >
      <span className="absolute left-0 top-5 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">
            {item.time
              ? new Date(item.time).toLocaleTimeString()
              : "-"}
          </p>

          <p className="mt-1 font-semibold text-cyan-400">
            {item.eventType ?? "Timeline Event"}
          </p>
        </div>

        <SeverityBadge
          severity={item.severity}
        />
      </div>

      <p className="mt-2 text-sm text-zinc-300 line-clamp-2">
        {item.description ?? "-"}
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        Case: {item.caseName ?? "-"} · Source:{" "}
        {item.source ?? "-"}
      </p>
    </Link>
  );
}

function MitreHeatmap({
  items,
}: {
  items: {
    tactic: string;
    count: number;
  }[];
}) {
  const max = Math.max(
    ...items.map((item) => item.count),
    1
  );

  if (items.length === 0) {
    return (
      <EmptyState text="No MITRE heatmap data." />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.tactic}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-zinc-300">
              {item.tactic}
            </span>

            <span className="text-zinc-500">
              {item.count}
            </span>
          </div>

          <div className="h-2 rounded bg-black">
            <div
              className="h-2 rounded bg-cyan-500"
              style={{
                width: `${Math.max(
                  8,
                  (item.count / max) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function AttributionSummary({
  items,
}: {
  items: DashboardAttributionItem[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.actor}
          className="rounded-xl border border-zinc-800 bg-black p-4"
        >
          <div className="flex items-center justify-between">
            <p className="font-bold">
              {item.actor}
            </p>

            <ConfidenceBadge
              confidence={item.confidence}
            />
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            Supporting Findings:{" "}
            {item.supportingFindings} · Evidence:{" "}
            {item.evidenceItems}
          </p>
        </div>
      ))}
    </div>
  );
}

function EvidenceProcessing({
  processing,
  percent,
}: {
  processing: {
    imported: number;
    parsed: number;
    analyzed: number;
    correlated: number;
    reported: number;
  };
  percent: number;
}) {
  return (
    <div>
      <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-8 border-cyan-500/60 bg-black">
        <div className="text-center">
          <p className="text-3xl font-bold">
            {percent}%
          </p>

          <p className="text-xs text-zinc-500">
            Analysis Completion
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <ProcessRow
          label="Imported"
          value={processing.imported}
        />

        <ProcessRow
          label="Parsed"
          value={processing.parsed}
        />

        <ProcessRow
          label="Analyzed"
          value={processing.analyzed}
        />

        <ProcessRow
          label="Correlated"
          value={processing.correlated}
        />

        <ProcessRow
          label="Reported"
          value={processing.reported}
        />
      </div>
    </div>
  );
}

function LessonsPending({
  items,
}: {
  items: DashboardLessonsPendingItem[];
}) {
  if (items.length === 0) {
    return (
      <EmptyState text="No pending lessons learned." />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.caseId}
          to={`/cases/${item.caseId}`}
          className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black p-4 hover:border-purple-500/50"
        >
          <BookOpen
            size={20}
            className="mt-1 text-purple-400"
          />

          <div>
            <p className="font-semibold">
              {item.caseName}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {item.reason}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-zinc-500">
        {label}
      </p>

      <p className="font-semibold text-zinc-200">
        {value}
      </p>
    </div>
  );
}

function SeverityBadge({
  severity,
}: {
  severity?: string | null;
}) {
  const normalized =
    severity?.toUpperCase() ?? "INFO";

  const className =
    normalized === "CRITICAL"
      ? "bg-red-500/10 text-red-400 border-red-500/30"
      : normalized === "HIGH"
      ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
      : normalized === "MEDIUM"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";

  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${className}`}
    >
      {normalized}
    </span>
  );
}

function ConfidenceBadge({
  confidence,
}: {
  confidence: "LOW" | "MEDIUM" | "HIGH";
}) {
  const className =
    confidence === "HIGH"
      ? "bg-green-500/10 text-green-400 border-green-500/30"
      : confidence === "MEDIUM"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      : "bg-blue-500/10 text-blue-400 border-blue-500/30";

  return (
    <span
      className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${className}`}
    >
      {confidence} CONFIDENCE
    </span>
  );
}

function ProcessRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex justify-between border-b border-zinc-800 pb-2">
      <span className="text-zinc-400">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  );
}

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <p className="rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-500">
      {text}
    </p>
  );
}