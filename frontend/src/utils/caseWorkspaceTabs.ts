import type {
  InvestigationType,
} from "../types/case";

export type WorkspaceTab =
  | "overview"
  | "evidence"
  | "activity"
  | "timeline"
  | "mitre"
  | "findings"
  | "attribution"
  | "lessons"
  | "custody"
  | "memory"
  | "processes"
  | "dll"
  | "malfind"
  | "yara"
  | "network"
  | "flows"
  | "dns"
  | "http"
  | "tls"
  | "files"
  | "mobile"
  | "apps"
  | "messages"
  | "calls"
  | "location"
  | "media";

export interface WorkspaceTabItem {
  id: WorkspaceTab;
  label: string;
  group:
    | "core"
    | "domain"
    | "analysis"
    | "governance";
}

const CORE_TABS: WorkspaceTabItem[] = [
  {
    id: "overview",
    label: "Overview",
    group: "core",
  },
  {
    id: "evidence",
    label: "Evidence",
    group: "core",
  },
];

const ANALYSIS_TABS: WorkspaceTabItem[] = [
  {
    id: "timeline",
    label: "Timeline",
    group: "analysis",
  },
  {
    id: "mitre",
    label: "MITRE",
    group: "analysis",
  },
  {
    id: "findings",
    label: "Findings",
    group: "analysis",
  },
  {
    id: "attribution",
    label: "Attribution",
    group: "analysis",
  },
];

const GOVERNANCE_TABS: WorkspaceTabItem[] = [
  {
    id: "lessons",
    label: "Lessons",
    group: "governance",
  },
  {
    id: "custody",
    label: "Custody",
    group: "governance",
  },
];

const DEFAULT_DOMAIN_TABS: WorkspaceTabItem[] = [
  {
    id: "activity",
    label: "Activity",
    group: "domain",
  },
];

const MEMORY_DOMAIN_TABS: WorkspaceTabItem[] = [
  {
    id: "memory",
    label: "Memory",
    group: "domain",
  },
  {
    id: "processes",
    label: "Processes",
    group: "domain",
  },
  {
    id: "dll",
    label: "DLL",
    group: "domain",
  },
  {
    id: "malfind",
    label: "Malfind",
    group: "domain",
  },
  {
    id: "yara",
    label: "YARA",
    group: "domain",
  },
];

const NETWORK_DOMAIN_TABS: WorkspaceTabItem[] = [
  {
    id: "network",
    label: "Network",
    group: "domain",
  },
  {
    id: "flows",
    label: "Flows",
    group: "domain",
  },
  {
    id: "dns",
    label: "DNS",
    group: "domain",
  },
  {
    id: "http",
    label: "HTTP",
    group: "domain",
  },
  {
    id: "tls",
    label: "TLS",
    group: "domain",
  },
  {
    id: "files",
    label: "Files",
    group: "domain",
  },
];

const MOBILE_DOMAIN_TABS: WorkspaceTabItem[] = [
  {
    id: "mobile",
    label: "Mobile",
    group: "domain",
  },
  {
    id: "apps",
    label: "Apps",
    group: "domain",
  },
  {
    id: "messages",
    label: "Messages",
    group: "domain",
  },
  {
    id: "calls",
    label: "Calls",
    group: "domain",
  },
  {
    id: "location",
    label: "Location",
    group: "domain",
  },
  {
    id: "media",
    label: "Media",
    group: "domain",
  },
];

export function getDomainTabs(
  type?: InvestigationType
): WorkspaceTabItem[] {
  switch (type) {
    case "MEMORY_FORENSICS":
      return MEMORY_DOMAIN_TABS;

    case "NETWORK_FORENSICS":
      return NETWORK_DOMAIN_TABS;

    case "MOBILE_FORENSICS":
      return MOBILE_DOMAIN_TABS;

    default:
      return DEFAULT_DOMAIN_TABS;
  }
}

export function getCaseWorkspaceTabs(
  type?: InvestigationType
): WorkspaceTabItem[] {
  return [
    ...CORE_TABS,
    ...getDomainTabs(type),
    ...ANALYSIS_TABS,
    ...GOVERNANCE_TABS,
  ];
}