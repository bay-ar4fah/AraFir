import type {
  InvestigationType,
} from "../types/case";

export interface ExpectedEvidenceItem {
  id: string;
  label: string;
  category: string;
}

export const INVESTIGATION_TYPE_LABELS: Record<
  InvestigationType,
  string
> = {
  WINDOWS_ENDPOINT: "Windows Endpoint",
  LINUX_SERVER: "Linux Server",
  MEMORY_FORENSICS: "Memory Forensics",
  NETWORK_FORENSICS: "Network Forensics",
  MOBILE_FORENSICS: "Mobile Forensics",
  CLOUD_FORENSICS: "Cloud Forensics",
  EMAIL_INVESTIGATION: "Email Investigation",
  MALWARE_ANALYSIS: "Malware Analysis",
  RANSOMWARE: "Ransomware Investigation",
  INSIDER_THREAT: "Insider Threat",
  MULTI_SOURCE: "Multi Source Investigation",
};

export const EXPECTED_EVIDENCE_TEMPLATES:
  Record<InvestigationType, ExpectedEvidenceItem[]> = {
  WINDOWS_ENDPOINT: [
    { id: "windows_event_log", label: "Windows Event Logs", category: "Endpoint" },
    { id: "registry_hives", label: "Registry Hives", category: "Endpoint" },
    { id: "prefetch", label: "Prefetch Files", category: "Endpoint" },
    { id: "amcache", label: "Amcache / Shimcache", category: "Endpoint" },
    { id: "mft", label: "MFT / USN Journal", category: "Filesystem" },
  ],
  LINUX_SERVER: [
    { id: "auth_log", label: "auth.log / secure", category: "Linux Logs" },
    { id: "bash_history", label: "Shell History", category: "User Activity" },
    { id: "cron", label: "Cron Jobs", category: "Persistence" },
    { id: "syslog", label: "Syslog", category: "System" },
  ],
  MEMORY_FORENSICS: [
    { id: "ram_dump", label: "RAM Dump", category: "Memory" },
    { id: "pagefile", label: "Pagefile", category: "Memory" },
    { id: "hiberfil", label: "Hibernation File", category: "Memory" },
    { id: "process_list", label: "Process Listing", category: "Volatility" },
    { id: "malfind", label: "Malfind Output", category: "Volatility" },
  ],
  NETWORK_FORENSICS: [
    { id: "pcap", label: "PCAP Capture", category: "Network" },
    { id: "netflow", label: "NetFlow", category: "Network" },
    { id: "dns_logs", label: "DNS Logs", category: "Network" },
    { id: "proxy_logs", label: "Proxy Logs", category: "Network" },
    { id: "firewall_logs", label: "Firewall Logs", category: "Network" },
  ],
  MOBILE_FORENSICS: [
    { id: "logical_extraction", label: "Logical Extraction", category: "Mobile" },
    { id: "filesystem_extraction", label: "File System Extraction", category: "Mobile" },
    { id: "physical_extraction", label: "Physical Extraction", category: "Mobile" },
    { id: "ufdr", label: "UFDR Report", category: "Cellebrite" },
    { id: "adb_backup", label: "ADB Backup", category: "Android" },
    { id: "sim_dump", label: "SIM Dump", category: "Mobile" },
  ],
  CLOUD_FORENSICS: [
    { id: "cloudtrail", label: "AWS CloudTrail", category: "AWS" },
    { id: "azure_activity", label: "Azure Activity Logs", category: "Azure" },
    { id: "gcp_audit", label: "GCP Audit Logs", category: "GCP" },
    { id: "iam_logs", label: "IAM Logs", category: "Identity" },
  ],
  EMAIL_INVESTIGATION: [
    { id: "email_headers", label: "Email Headers", category: "Email" },
    { id: "mailbox_export", label: "Mailbox Export", category: "Email" },
    { id: "attachment", label: "Suspicious Attachment", category: "Email" },
    { id: "message_trace", label: "Message Trace", category: "Email" },
  ],
  MALWARE_ANALYSIS: [
    { id: "sample", label: "Malware Sample", category: "Malware" },
    { id: "strings", label: "Strings Output", category: "Static" },
    { id: "yara", label: "YARA Results", category: "Detection" },
    { id: "sandbox", label: "Sandbox Report", category: "Dynamic" },
  ],
  RANSOMWARE: [
    { id: "ransom_note", label: "Ransom Note", category: "Ransomware" },
    { id: "encrypted_files", label: "Encrypted File Samples", category: "Ransomware" },
    { id: "event_logs", label: "Windows Event Logs", category: "Endpoint" },
    { id: "edr_logs", label: "EDR Telemetry", category: "Endpoint" },
    { id: "network_logs", label: "Network Logs", category: "Network" },
  ],
  INSIDER_THREAT: [
    { id: "user_activity", label: "User Activity Logs", category: "User" },
    { id: "file_access", label: "File Access Logs", category: "Filesystem" },
    { id: "usb_activity", label: "USB Activity", category: "Endpoint" },
    { id: "email_activity", label: "Email Activity", category: "Communication" },
  ],
  MULTI_SOURCE: [
    { id: "event_logs", label: "Event Logs", category: "General" },
    { id: "edr_logs", label: "EDR Logs", category: "General" },
    { id: "network_logs", label: "Network Logs", category: "General" },
    { id: "forensic_image", label: "Forensic Image", category: "General" },
  ],
};

export function getTemplateEvidence(
  type: InvestigationType
) {
  return EXPECTED_EVIDENCE_TEMPLATES[type] ??
    EXPECTED_EVIDENCE_TEMPLATES.MULTI_SOURCE;
}