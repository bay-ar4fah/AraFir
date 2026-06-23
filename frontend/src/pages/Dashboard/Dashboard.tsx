import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
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
    useState<InvestigationDashboard | null>(null);

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
    if (!data || evidenceTotal === 0) return 0;

    return Math.round(
      (data.evidenceProcessing.analyzed /
        evidenceTotal) *
        100
    );
  }, [data, evidenceTotal]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-sm text-zinc-400">
        Loading investigation dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-sm text-zinc-400">
        No dashboard data available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 text-white md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-5">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
              AraFir DFIR Platform
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Investigation Command Center
            </h1>

            <p className="mt-1 max-w-3xl text-sm text-zinc-400">
              Investigation overview, attack timeline intelligence,
              forensic findings, evidence processing, and post-incident
              follow-up.
            </p>
          </div>

          <button
            onClick={loadDashboard}
            className="w-fit rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            Refresh Dashboard
          </button>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={<BriefcaseBusiness size={20} />}
            title="Open Cases"
            value={data.metrics.openCases}
            accent="cyan"
            subtitle="Active investigations"
          />

          <MetricCard
            icon={<ShieldAlert size={20} />}
            title="Active Findings"
            value={data.metrics.activeFindings}
            accent="purple"
            subtitle="MITRE / forensic findings"
          />

          <MetricCard
            icon={<FolderSearch size={20} />}
            title="Evidence Items"
            value={data.metrics.evidenceItems}
            accent="emerald"
            subtitle="Imported artifacts"
          />

          <MetricCard
            icon={<Target size={20} />}
            title="Attribution Models"
            value={data.metrics.attributionModels}
            accent="orange"
            subtitle="Candidate profiles"
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[0.95fr_1.15fr_1.15fr]">
          <Panel
            title="Active Investigations"
            actionLabel="View all cases"
            actionPath="/cases"
          >
            <div className="space-y-3">
              {data.activeInvestigations.length === 0 ? (
                <EmptyState text="No active investigations found." />
              ) : (
                data.activeInvestigations
                  .slice(0, 4)
                  .map((item) => (
                    <ActiveInvestigationCard
                      key={item.id}
                      item={item}
                    />
                  ))
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
                data.recentFindings
                  .slice(0, 5)
                  .map((item) => (
                    <FindingRow
                      key={item.id}
                      item={item}
                    />
                  ))
              )}
            </div>
          </Panel>

          <Panel
            title="Attack Timeline Intelligence"
            actionLabel="View timeline"
            actionPath="/timeline"
          >
            <div className="space-y-3">
              {data.attackTimeline.length === 0 ? (
                <EmptyState text="No timeline events available yet." />
              ) : (
                data.attackTimeline
                  .slice(0, 5)
                  .map((item) => (
                    <TimelineIntelRow
                      key={item.id}
                      item={item}
                    />
                  ))
              )}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-4">
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
            actionLabel="View cases"
            actionPath="/cases"
          >
            <AttributionSummary
              items={data.attributionSummary}
            />
          </Panel>

          <Panel
            title="Evidence Processing"
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
        </section>
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
  icon: ReactNode;
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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${accentClass}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-zinc-400">
            {title}
          </p>

          <h2 className="text-3xl font-bold leading-tight">
            {value}
          </h2>

          <p className="mt-1 text-xs leading-4 text-zinc-500">
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
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">
          {title}
        </h2>

        {actionLabel && actionPath && (
          <Link
            to={actionPath}
            className="shrink-0 text-xs font-medium text-cyan-400 hover:text-cyan-300"
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
      className="block rounded-xl border border-zinc-800 bg-black/80 p-3 transition hover:border-cyan-600"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">
            {item.caseName}
          </p>

          <p className="mt-1 truncate font-mono text-[11px] text-zinc-500">
            ID: {item.id}
          </p>
        </div>

        <span className="rounded bg-green-500/10 px-2 py-1 text-[10px] font-semibold text-green-400">
          {item.status ?? "OPEN"}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
        {item.description ?? "-"}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
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
      className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black/80 p-3 transition hover:border-purple-500/50"
    >
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
        <Skull size={15} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">
            {item.title}
          </p>

          <SeverityBadge
            severity={item.severity}
          />
        </div>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
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
      className="relative block rounded-xl border border-zinc-800 bg-black/80 p-3 pl-5 transition hover:border-cyan-600"
    >
      <span className="absolute left-0 top-5 h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-400" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] text-zinc-500">
            {item.time
              ? new Date(item.time).toLocaleTimeString()
              : "-"}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-cyan-400">
            {item.eventType ?? "Timeline Event"}
          </p>
        </div>

        <SeverityBadge
          severity={item.severity}
        />
      </div>

      <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-300">
        {item.description ?? "-"}
      </p>

      <p className="mt-2 line-clamp-1 text-[11px] text-zinc-500">
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
      {items.slice(0, 7).map((item) => (
        <div key={item.tactic}>
          <div className="mb-1 flex justify-between text-xs">
            <span className="truncate text-zinc-300">
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
      {items.slice(0, 3).map((item) => (
        <div
          key={item.actor}
          className="rounded-xl border border-zinc-800 bg-black/80 p-3"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-bold">
              {item.actor}
            </p>

            <ConfidenceBadge
              confidence={item.confidence}
            />
          </div>

          <p className="mt-2 text-xs leading-5 text-zinc-500">
            Findings: {item.supportingFindings} · Evidence:{" "}
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
      <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[10px] border-cyan-500/60 bg-black">
        <div className="text-center">
          <p className="text-2xl font-bold">
            {percent}%
          </p>

          <p className="text-[10px] leading-3 text-zinc-500">
            Analysis
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs">
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
      {items.slice(0, 4).map((item) => (
        <Link
          key={item.caseId}
          to={`/cases/${item.caseId}`}
          className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black/80 p-3 hover:border-purple-500/50"
        >
          <BookOpen
            size={17}
            className="mt-1 shrink-0 text-purple-400"
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {item.caseName}
            </p>

            <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">
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
    <div className="min-w-0">
      <p className="truncate text-zinc-500">
        {label}
      </p>

      <p className="truncate font-semibold text-zinc-200">
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
      className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold ${className}`}
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
      className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-semibold ${className}`}
    >
      {confidence}
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
    <p className="rounded-xl border border-zinc-800 bg-black/80 p-4 text-xs text-zinc-500">
      {text}
    </p>
  );
}