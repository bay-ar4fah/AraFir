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
  WINDOWS_FORENSICS: "Windows Forensics",
  LINUX_FORENSICS: "Linux Forensics",
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
  WINDOWS_FORENSICS: [
  { id: "windows_event_logs", label: "Windows Event Logs (EVTX)", category: "Event Logs" },
  { id: "powershell_logs", label: "PowerShell Operational Logs", category: "Event Logs" },
  { id: "sysmon_logs", label: "Sysmon Logs", category: "Event Logs" },
  { id: "powershell_logs", label: "PowerShell Operational Logs", category: "Event Logs" },
  { id: "sysmon_logs", label: "Sysmon Logs", category: "Event Logs" },
  { id: "registry_hives", label: "Registry Hives", category: "Registry" },
  { id: "userassist", label: "UserAssist", category: "Registry" },
  { id: "bam_dam", label: "BAM / DAM", category: "Registry" },
  { id: "run_keys", label: "Run / RunOnce Keys", category: "Persistence" },
  { id: "services_registry", label: "Services Registry", category: "Persistence" },
  { id: "prefetch", label: "Prefetch", category: "Execution" },
  { id: "amcache", label: "Amcache", category: "Execution" },
  { id: "shimcache", label: "ShimCache", category: "Execution" },
  { id: "recent_files", label: "Recent Files", category: "Execution" },
  { id: "jump_lists", label: "Jump Lists", category: "Execution" },
  { id: "lnk_files", label: "Shortcut (.LNK)", category: "Execution" },
  { id: "mft", label: "$MFT", category: "Filesystem" },
  { id: "usn_journal", label: "USN Journal", category: "Filesystem" },
  { id: "recycle_bin", label: "Recycle Bin", category: "Filesystem" },
  { id: "volume_shadow_copy", label: "Volume Shadow Copy", category: "Filesystem" },
  { id: "browser_history", label: "Browser History", category: "Browser" },
  { id: "browser_downloads", label: "Browser Downloads", category: "Browser" },
  { id: "browser_cookies", label: "Browser Cookies", category: "Browser" },
  { id: "usb_history", label: "USB Device History", category: "User Activity" },
  { id: "rdp_history", label: "Remote Desktop History", category: "User Activity" },
  { id: "scheduled_tasks", label: "Scheduled Tasks", category: "Persistence" },
  { id: "startup_folder", label: "Startup Folder", category: "Persistence"},
  { id: "memory_dump", label: "RAM Dump", category: "Memory"},
  { id: "pagefile", label: "Pagefile.sys", category: "Memory"},
  { id: "hiberfil", label: "Hiberfil.sys", category: "Memory"},
  { id: "firewall_logs", label: "Windows Firewall Logs", category: "Network" },
  { id: "dns_cache", label: "DNS Cache", category: "Network" },
  { id: "arp_cache", label: "ARP Cache", category: "Network" },
  { id: "hosts_file", label: "Hosts File", category: "Network" },
  { id: "windows_defender", label: "Microsoft Defender Logs", category: "Security" },
  { id: "edr_logs", label: "EDR / XDR Logs", category: "Security" },
  { id: "timeline", label: "Super Timeline", category: "Timeline" },
],
  LINUX_FORENSICS: [
  { id: "auth_logs", label: "auth.log / secure", category: "Authentication" },
  { id: "syslog", label: "Syslog", category: "System Logs" },
  { id: "journalctl", label: "Systemd Journal", category: "System Logs" },
  { id: "bash_history", label: "Shell History", category: "User Activity" },
  { id: "sudo_logs", label: "Sudo Logs", category: "Privilege Escalation" },
  { id: "cron_jobs", label: "Cron Jobs", category: "Persistence" },
  { id: "systemd_services", label: "Systemd Services", category: "Persistence" },
  { id: "ssh_artifacts", label: "SSH Keys / Known Hosts", category: "Remote Access" },
  { id: "process_list", label: "Process Listing", category: "Runtime" },
  { id: "network_connections", label: "Network Connections", category: "Network" },
  { id: "file_integrity", label: "File Integrity / Hashes", category: "Filesystem" },
  { id: "web_logs", label: "Apache / Nginx Logs", category: "Web Server" },
  { id: "auditd_logs", label: "Auditd Logs", category: "Audit" },
  { id: "linux_memory", label: "Linux Memory Dump", category: "Memory" },
],

MEMORY_FORENSICS: [
  { id: "ram_dump", label: "RAM Dump", category: "Memory Image" },
  { id: "pagefile", label: "Pagefile.sys", category: "Windows Memory" },
  { id: "hiberfil", label: "Hiberfil.sys", category: "Windows Memory" },
  { id: "process_list", label: "Process Listing", category: "Volatility" },
  { id: "process_tree", label: "Process Tree", category: "Volatility" },
  { id: "dll_list", label: "DLL List", category: "Process Artifacts" },
  { id: "handles", label: "Handles", category: "Process Artifacts" },
  { id: "cmdline", label: "Command Line", category: "Execution" },
  { id: "netscan", label: "Network Scan", category: "Network" },
  { id: "malfind", label: "Malfind Output", category: "Injection" },
  { id: "yarascan", label: "YARA Scan", category: "Detection" },
  { id: "registry_hives_memory", label: "Registry Hives from Memory", category: "Registry" },
  { id: "memory_timeline", label: "Memory Timeline", category: "Timeline" },
],

NETWORK_FORENSICS: [
  { id: "pcap", label: "PCAP Capture", category: "Packet Capture" },
  { id: "netflow", label: "NetFlow / IPFIX", category: "Flow Data" },
  { id: "zeek_logs", label: "Zeek Logs", category: "Network Metadata" },
  { id: "suricata_logs", label: "Suricata / IDS Logs", category: "IDS" },
  { id: "dns_logs", label: "DNS Logs", category: "DNS" },
  { id: "http_logs", label: "HTTP Logs", category: "Web Traffic" },
  { id: "tls_logs", label: "TLS / SSL Logs", category: "Encrypted Traffic" },
  { id: "proxy_logs", label: "Proxy Logs", category: "Proxy" },
  { id: "firewall_logs", label: "Firewall Logs", category: "Perimeter" },
  { id: "vpn_logs", label: "VPN Logs", category: "Remote Access" },
  { id: "extracted_files", label: "Extracted Files", category: "File Extraction" },
  { id: "network_iocs", label: "Network IOCs", category: "IOC" },
],

MOBILE_FORENSICS: [
  { id: "logical_extraction", label: "Logical Extraction", category: "Acquisition" },
  { id: "filesystem_extraction", label: "File System Extraction", category: "Acquisition" },
  { id: "physical_extraction", label: "Physical Extraction", category: "Acquisition" },
  { id: "ufdr", label: "UFDR Report", category: "Cellebrite" },
  { id: "adb_backup", label: "ADB Backup", category: "Android" },
  { id: "sim_dump", label: "SIM Dump", category: "SIM" },
  { id: "device_info", label: "Device Information", category: "Device" },
  { id: "installed_apps", label: "Installed Applications", category: "Apps" },
  { id: "app_permissions", label: "App Permissions", category: "Apps" },
  { id: "messages", label: "SMS / MMS", category: "Messages" },
  { id: "whatsapp", label: "WhatsApp Artifacts", category: "Messaging" },
  { id: "call_logs", label: "Call Logs", category: "Communication" },
  { id: "contacts", label: "Contacts", category: "Communication" },
  { id: "location_history", label: "Location History", category: "Location" },
  { id: "media_exif", label: "Media / EXIF", category: "Media" },
  { id: "browser_mobile", label: "Mobile Browser Artifacts", category: "Browser" },
],

CLOUD_FORENSICS: [
  { id: "aws_cloudtrail", label: "AWS CloudTrail", category: "AWS" },
  { id: "aws_guardduty", label: "AWS GuardDuty Findings", category: "AWS" },
  { id: "aws_vpc_flow", label: "AWS VPC Flow Logs", category: "AWS Network" },
  { id: "azure_activity", label: "Azure Activity Logs", category: "Azure" },
  { id: "azure_signin", label: "Azure AD Sign-in Logs", category: "Azure Identity" },
  { id: "azure_audit", label: "Azure AD Audit Logs", category: "Azure Identity" },
  { id: "gcp_audit", label: "GCP Audit Logs", category: "GCP" },
  { id: "gcp_vpc_flow", label: "GCP VPC Flow Logs", category: "GCP Network" },
  { id: "iam_logs", label: "IAM Logs", category: "Identity" },
  { id: "cloud_storage_logs", label: "Cloud Storage Access Logs", category: "Storage" },
  { id: "container_logs", label: "Container / Kubernetes Logs", category: "Container" },
],

EMAIL_INVESTIGATION: [
  { id: "email_headers", label: "Email Headers", category: "Email" },
  { id: "mailbox_export", label: "Mailbox Export", category: "Mailbox" },
  { id: "message_trace", label: "Message Trace", category: "Email Gateway" },
  { id: "suspicious_attachment", label: "Suspicious Attachment", category: "Attachment" },
  { id: "url_rewrite_logs", label: "URL Rewrite / Click Logs", category: "Email Security" },
  { id: "spf_dkim_dmarc", label: "SPF / DKIM / DMARC Results", category: "Authentication" },
  { id: "phishing_urls", label: "Phishing URLs", category: "IOC" },
  { id: "mailbox_rules", label: "Mailbox Rules", category: "Persistence" },
  { id: "oauth_grants", label: "OAuth Grants", category: "Cloud Email" },
],

MALWARE_ANALYSIS: [
  { id: "sample", label: "Malware Sample", category: "Sample" },
  { id: "hashes", label: "Hashes", category: "Static" },
  { id: "strings", label: "Strings Output", category: "Static" },
  { id: "imports_exports", label: "Imports / Exports", category: "Static" },
  { id: "pe_metadata", label: "PE Metadata", category: "Static" },
  { id: "yara", label: "YARA Results", category: "Detection" },
  { id: "sigma", label: "Sigma Mapping", category: "Detection" },
  { id: "sandbox", label: "Sandbox Report", category: "Dynamic" },
  { id: "process_behavior", label: "Process Behavior", category: "Dynamic" },
  { id: "network_behavior", label: "Network Behavior", category: "Dynamic" },
  { id: "persistence_behavior", label: "Persistence Behavior", category: "Dynamic" },
  { id: "mitre_capabilities", label: "MITRE Capability Mapping", category: "ATT&CK" },
],

RANSOMWARE: [
  { id: "ransom_note", label: "Ransom Note", category: "Ransomware" },
  { id: "encrypted_files", label: "Encrypted File Samples", category: "Ransomware" },
  { id: "file_extension_pattern", label: "Encrypted Extension Pattern", category: "Ransomware" },
  { id: "windows_event_logs", label: "Windows Event Logs", category: "Endpoint" },
  { id: "edr_logs", label: "EDR / XDR Telemetry", category: "Endpoint" },
  { id: "vss_deletion", label: "Volume Shadow Copy Deletion", category: "Impact" },
  { id: "lateral_movement", label: "Lateral Movement Evidence", category: "Movement" },
  { id: "credential_access", label: "Credential Access Evidence", category: "Credential" },
  { id: "network_logs", label: "Network Logs", category: "Network" },
  { id: "exfiltration_evidence", label: "Exfiltration Evidence", category: "Data Theft" },
  { id: "backup_status", label: "Backup / Recovery Evidence", category: "Recovery" },
],

INSIDER_THREAT: [
  { id: "user_activity", label: "User Activity Logs", category: "User" },
  { id: "file_access", label: "File Access Logs", category: "Filesystem" },
  { id: "usb_activity", label: "USB Activity", category: "Endpoint" },
  { id: "email_activity", label: "Email Activity", category: "Communication" },
  { id: "printing_activity", label: "Printing Activity", category: "Data Movement" },
  { id: "cloud_storage_activity", label: "Cloud Storage Activity", category: "Cloud" },
  { id: "dlp_alerts", label: "DLP Alerts", category: "Data Protection" },
  { id: "vpn_activity", label: "VPN Activity", category: "Remote Access" },
  { id: "badge_access", label: "Physical Badge Access", category: "Physical" },
],

MULTI_SOURCE: [
  { id: "event_logs", label: "Event Logs", category: "General" },
  { id: "edr_logs", label: "EDR / XDR Logs", category: "General" },
  { id: "network_logs", label: "Network Logs", category: "General" },
  { id: "forensic_image", label: "Forensic Image", category: "General" },
  { id: "memory_dump", label: "Memory Dump", category: "General" },
  { id: "mobile_extraction", label: "Mobile Extraction", category: "General" },
  { id: "cloud_logs", label: "Cloud Logs", category: "General" },
  { id: "email_artifacts", label: "Email Artifacts", category: "General" },
],
};

export function getTemplateEvidence(
  type: InvestigationType
) {
  return EXPECTED_EVIDENCE_TEMPLATES[type] ??
    EXPECTED_EVIDENCE_TEMPLATES.MULTI_SOURCE;
}