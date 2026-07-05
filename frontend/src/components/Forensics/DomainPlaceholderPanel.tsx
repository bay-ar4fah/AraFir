import { Link } from "react-router-dom";

import {
  ArrowRight,
  Brain,
  FileSearch,
  Network,
  Smartphone,
} from "lucide-react";

import type {
  InvestigationType,
} from "../../types/case";

import type {
  WorkspaceTab,
} from "../../utils/caseWorkspaceTabs";

interface Props {
  caseId: string;
  investigationType?: InvestigationType;
  activeTab: WorkspaceTab;
}

function getIcon(type?: InvestigationType) {
  if (type === "MEMORY_FORENSICS") {
    return Brain;
  }

  if (type === "NETWORK_FORENSICS") {
    return Network;
  }

  if (type === "MOBILE_FORENSICS") {
    return Smartphone;
  }

  return FileSearch;
}

function getDomainTitle(type?: InvestigationType) {
  if (type === "MEMORY_FORENSICS") {
    return "Memory Forensics Workspace";
  }

  if (type === "NETWORK_FORENSICS") {
    return "Network Forensics Workspace";
  }

  if (type === "MOBILE_FORENSICS") {
    return "Mobile Forensics Workspace";
  }

  return "Investigation Domain Workspace";
}

function getDescription(
  type?: InvestigationType,
  activeTab?: WorkspaceTab
) {
  if (type === "MEMORY_FORENSICS") {
    return `Case-linked memory analysis module for ${activeTab}. This workspace is now connected to the dedicated Memory Workspace for process, command line, injection, malware indicator, and network artifact review.`;
  }

  if (type === "NETWORK_FORENSICS") {
    return `Case-linked network analysis module for ${activeTab}. Future implementation will include flows, DNS, HTTP, TLS, extracted files, sessions, and protocol timeline.`;
  }

  if (type === "MOBILE_FORENSICS") {
    return `Case-linked mobile analysis module for ${activeTab}. Future implementation will include apps, messages, calls, browser artifacts, location, media, and extraction metadata.`;
  }

  return `Case-linked investigation module for ${activeTab}.`;
}

function getWorkspacePath(
  caseId: string,
  type?: InvestigationType
) {
  if (type === "MEMORY_FORENSICS") {
    return `/cases/${caseId}/memory`;
  }

  return null;
}

function getCapabilityTitle(type?: InvestigationType) {
  if (type === "MEMORY_FORENSICS") {
    return "Enterprise Memory Capabilities";
  }

  return "Planned Enterprise Capabilities";
}

function getCapabilities(type?: InvestigationType) {
  if (type === "MEMORY_FORENSICS") {
    return [
      "Case-linked memory artifact review",
      "Process and command-line investigation",
      "Suspicious process triage",
      "Memory network artifact mapping",
      "MITRE technique enrichment",
      "Finding-ready forensic summary",
    ];
  }

  return [
    "Case-linked artifact extraction",
    "Artifact-to-evidence relationship mapping",
    "Timeline enrichment from parsed artifacts",
    "Suggested findings with confidence scoring",
    "IOC extraction and correlation",
    "Report-ready forensic summary",
  ];
}

export default function DomainPlaceholderPanel({
  caseId,
  investigationType,
  activeTab,
}: Props) {
  const Icon = getIcon(investigationType);
  const workspacePath = getWorkspacePath(
    caseId,
    investigationType
  );

  const isMemoryWorkspace =
    investigationType === "MEMORY_FORENSICS";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Icon size={22} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold">
                {getDomainTitle(investigationType)}
              </h2>

              {isMemoryWorkspace && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                  Active
                </span>
              )}
            </div>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-zinc-400">
              {getDescription(
                investigationType,
                activeTab
              )}
            </p>

            <p className="mt-3 font-mono text-[11px] text-zinc-500">
              Case ID: {caseId}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg border border-zinc-700 bg-black/50 px-3 py-1 text-xs text-zinc-400">
            {activeTab.toUpperCase()}
          </span>

          {workspacePath ? (
            <Link
              to={workspacePath}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20 hover:text-cyan-200"
            >
              Open Memory Workspace
              <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-700 bg-black/50 px-3 py-1 text-xs text-zinc-500">
              Planned
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <DomainMetric
          label="Linked Evidence"
          value="0"
        />

        <DomainMetric
          label={
            isMemoryWorkspace
              ? "Memory Artifacts"
              : "Parsed Artifacts"
          }
          value="0"
        />

        <DomainMetric
          label={
            isMemoryWorkspace
              ? "Suspicious Indicators"
              : "Suggested Findings"
          }
          value="0"
        />
      </div>

      {workspacePath && (
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-cyan-100">
                Dedicated Memory Workspace Available
              </h3>

              <p className="mt-1 text-xs leading-5 text-cyan-200/70">
                Continue this case into the Memory Workspace to review
                process artifacts, command lines, suspicious indicators,
                MITRE mappings, and memory-derived network traces.
              </p>
            </div>

            <Link
              to={workspacePath}
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-cyan-300"
            >
              Open Workspace
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-xl border border-zinc-800 bg-black/70 p-4">
        <h3 className="text-sm font-semibold">
          {getCapabilityTitle(investigationType)}
        </h3>

        <div className="mt-3 grid gap-2 text-xs text-zinc-400 md:grid-cols-2">
          {getCapabilities(investigationType).map((capability) => (
            <Capability
              key={capability}
              text={capability}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DomainMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-black/70 p-4">
      <p className="text-xs text-zinc-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}

function Capability({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2">
      {text}
    </div>
  );
}