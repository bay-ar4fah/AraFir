import type {
  InvestigationType,
} from "../types/case";

export function getDomainTabs(
  type: InvestigationType
) {
  switch (type) {
    case "MEMORY_FORENSICS":
      return [
        "Memory",
        "Processes",
        "Malfind",
        "YARA",
      ];

    case "NETWORK_FORENSICS":
      return [
        "Network",
        "Flows",
        "DNS",
        "HTTP",
        "TLS",
      ];

    case "MOBILE_FORENSICS":
      return [
        "Mobile",
        "Apps",
        "Messages",
        "Calls",
        "Location",
        "Media",
      ];

    case "MALWARE_ANALYSIS":
      return [
        "Static",
        "Dynamic",
        "Strings",
        "YARA",
      ];

    default:
      return [];
  }
}