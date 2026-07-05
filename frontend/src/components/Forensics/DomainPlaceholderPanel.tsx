import {
  Brain,
  Network,
  Smartphone,
  FileSearch,
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

function getDomainTitle(
  type?: InvestigationType
) {
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
    return `Case-linked memory analysis module for ${activeTab}. Future implementation will include process tree, DLL, handles, malfind, YARA, and memory timeline.`;
  }

  if (type === "NETWORK_FORENSICS") {
    return `Case-linked network analysis module for ${activeTab}. Future implementation will include flows, DNS, HTTP, TLS, extracted files, sessions, and protocol timeline.`;
  }

  if (type === "MOBILE_FORENSICS") {
    return `Case-linked mobile analysis module for ${activeTab}. Future implementation will include apps, messages, calls, browser artifacts, location, media, and extraction metadata.`;
  }

  return `Case-linked investigation module for ${activeTab}.`;
}

export default function DomainPlaceholderPanel({
  caseId,
  investigationType,
  activeTab,
}: Props) {
  const Icon = getIcon(investigationType);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Icon size={22} />
          </div>

          <div>
            <h2 className="text-base font-bold">
              {getDomainTitle(investigationType)}
            </h2>

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

        <span className="rounded-lg border border-zinc-700 bg-black/50 px-3 py-1 text-xs text-zinc-400">
          {activeTab.toUpperCase()}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <DomainMetric
          label="Linked Evidence"
          value="0"
        />

        <DomainMetric
          label="Parsed Artifacts"
          value="0"
        />

        <DomainMetric
          label="Suggested Findings"
          value="0"
        />
      </div>

      <div className="mt-5 rounded-xl border border-zinc-800 bg-black/70 p-4">
        <h3 className="text-sm font-semibold">
          Planned Enterprise Capabilities
        </h3>

        <div className="mt-3 grid gap-2 text-xs text-zinc-400 md:grid-cols-2">
          <Capability text="Case-linked artifact extraction" />
          <Capability text="Artifact-to-evidence relationship mapping" />
          <Capability text="Timeline enrichment from parsed artifacts" />
          <Capability text="Suggested findings with confidence scoring" />
          <Capability text="IOC extraction and correlation" />
          <Capability text="Report-ready forensic summary" />
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