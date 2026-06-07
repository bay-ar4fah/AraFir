import type { TimelineEvent } from "../types/timeline";
import type { MitreFinding } from "../types/mitre";

export interface MitreRule {
  id: string;
  tactic: string;
  techniqueId: string;
  techniqueName: string;
  severity: MitreFinding["severity"];
  confidence: MitreFinding["confidence"];
  match: (event: TimelineEvent) => boolean;
  description: (event: TimelineEvent) => string;
}

function rawContains(
  event: TimelineEvent,
  keyword: string
): boolean {
  return (
    event.rawData
      ?.toLowerCase()
      .includes(keyword.toLowerCase()) ?? false
  );
}

function anyRawContains(
  event: TimelineEvent,
  keywords: string[]
): boolean {
  return keywords.some((keyword) =>
    rawContains(event, keyword)
  );
}

function eventTypeIs(
  event: TimelineEvent,
  type: string
): boolean {
  return event.eventType === type;
}

export const mitreRules: MitreRule[] = [
  {
    id: "phishing-attachment",
    tactic: "Initial Access",
    techniqueId: "T1566.001",
    techniqueName: "Spearphishing Attachment",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "attachment",
        ".docm",
        ".xlsm",
        "macro",
        "winword.exe",
        "excel.exe",
      ]),
    description: () =>
      "Potential phishing attachment or macro-based initial access detected.",
  },

  {
    id: "exploit-public-facing-app",
    tactic: "Initial Access",
    techniqueId: "T1190",
    techniqueName: "Exploit Public-Facing Application",
    severity: "CRITICAL",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "webshell",
        "iis",
        "w3wp.exe",
        "cmd /c",
        "powershell -enc",
      ]),
    description: () =>
      "Potential exploitation of public-facing application detected.",
  },

  {
    id: "powershell-execution",
    tactic: "Execution",
    techniqueId: "T1059.001",
    techniqueName: "PowerShell",
    severity: "HIGH",
    confidence: "HIGH",
    match: (event) =>
      eventTypeIs(event, "POWERSHELL_EXECUTION") ||
      anyRawContains(event, [
        "powershell.exe",
        "pwsh.exe",
        "-encodedcommand",
        "-enc",
        "iex",
        "invoke-expression",
        "downloadstring",
      ]),
    description: () =>
      "PowerShell execution detected from event telemetry.",
  },

  {
    id: "cmd-execution",
    tactic: "Execution",
    techniqueId: "T1059.003",
    techniqueName: "Windows Command Shell",
    severity: "MEDIUM",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "cmd.exe",
        "cmd /c",
        "cmd /k",
      ]),
    description: () =>
      "Windows command shell execution detected.",
  },

  {
    id: "script-execution",
    tactic: "Execution",
    techniqueId: "T1059",
    techniqueName: "Command and Scripting Interpreter",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "wscript.exe",
        "cscript.exe",
        ".vbs",
        ".js",
        ".jse",
        ".ps1",
        ".bat",
      ]),
    description: () =>
      "Suspicious script execution detected.",
  },

  {
    id: "scheduled-task-execution",
    tactic: "Execution",
    techniqueId: "T1053.005",
    techniqueName: "Scheduled Task",
    severity: "MEDIUM",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "schtasks.exe",
        "task scheduler",
        "scheduled task",
      ]),
    description: () =>
      "Scheduled task execution or creation detected.",
  },

  {
    id: "windows-service",
    tactic: "Persistence",
    techniqueId: "T1543.003",
    techniqueName: "Windows Service",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      eventTypeIs(event, "SERVICE_INSTALLED") ||
      anyRawContains(event, [
        "service installed",
        "sc.exe create",
        "new-service",
        "7045",
      ]),
    description: () =>
      "Windows service installation detected.",
  },

  {
    id: "registry-run-key",
    tactic: "Persistence",
    techniqueId: "T1060",
    techniqueName: "Registry Run Keys / Startup Folder",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "\\run",
        "\\runonce",
        "currentversion\\run",
        "startup folder",
      ]),
    description: () =>
      "Registry Run Key or startup persistence detected.",
  },

  {
    id: "wmi-persistence",
    tactic: "Persistence",
    techniqueId: "T1546.003",
    techniqueName: "Windows Management Instrumentation Event Subscription",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "__eventfilter",
        "__eventconsumer",
        "__filtertoconsumerbinding",
        "wmic",
        "wmi event",
      ]),
    description: () =>
      "Potential WMI event subscription persistence detected.",
  },

  {
    id: "special-privileges",
    tactic: "Privilege Escalation",
    techniqueId: "T1078",
    techniqueName: "Valid Accounts",
    severity: "MEDIUM",
    confidence: "MEDIUM",
    match: (event) =>
      eventTypeIs(event, "SPECIAL_PRIVILEGES_ASSIGNED") ||
      rawContains(event, "4672"),
    description: () =>
      "Special privileges assigned to a logon session.",
  },

  {
    id: "uac-bypass",
    tactic: "Privilege Escalation",
    techniqueId: "T1548.002",
    techniqueName: "Bypass User Account Control",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "fodhelper.exe",
        "eventvwr.exe",
        "computerdefaults.exe",
        "sdclt.exe",
        "uac",
      ]),
    description: () =>
      "Possible UAC bypass technique detected.",
  },

  {
    id: "rundll32-execution",
    tactic: "Defense Evasion",
    techniqueId: "T1218.011",
    techniqueName: "Rundll32",
    severity: "HIGH",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "rundll32",
        "rundll32.exe",
        "shdocvw",
        "openurl",
      ]),
    description: () =>
      "Suspicious Rundll32 LOLBIN execution detected.",
  },

  {
    id: "regsvr32-execution",
    tactic: "Defense Evasion",
    techniqueId: "T1218.010",
    techniqueName: "Regsvr32",
    severity: "HIGH",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "regsvr32.exe",
        "scrobj.dll",
        "/i:",
      ]),
    description: () =>
      "Regsvr32 proxy execution detected.",
  },

  {
    id: "mshta-execution",
    tactic: "Defense Evasion",
    techniqueId: "T1218.005",
    techniqueName: "Mshta",
    severity: "HIGH",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "mshta.exe",
        ".hta",
      ]),
    description: () =>
      "Mshta LOLBIN execution detected.",
  },

  {
    id: "signed-binary-proxy-execution",
    tactic: "Defense Evasion",
    techniqueId: "T1218",
    techniqueName: "System Binary Proxy Execution",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "rundll32.exe",
        "regsvr32.exe",
        "mshta.exe",
        "installutil.exe",
        "msbuild.exe",
        "certutil.exe",
      ]),
    description: () =>
      "Execution through trusted Windows binary detected.",
  },

  {
    id: "indicator-removal",
    tactic: "Defense Evasion",
    techniqueId: "T1070",
    techniqueName: "Indicator Removal",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "wevtutil cl",
        "clear-eventlog",
        "remove-item",
        "del /f",
        "vssadmin delete shadows",
      ]),
    description: () =>
      "Potential log clearing or evidence removal detected.",
  },

  {
    id: "disable-defender",
    tactic: "Defense Evasion",
    techniqueId: "T1562.001",
    techniqueName: "Disable or Modify Tools",
    severity: "CRITICAL",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "set-mppreference",
        "disableantispyware",
        "disablerealtimemonitoring",
        "windefend",
        "securityhealthservice",
      ]),
    description: () =>
      "Potential security tool disabling detected.",
  },

  {
    id: "credential-dumping",
    tactic: "Credential Access",
    techniqueId: "T1003",
    techniqueName: "OS Credential Dumping",
    severity: "CRITICAL",
    confidence: "HIGH",
    match: (event) =>
      eventTypeIs(event, "CREDENTIAL_DUMPING") ||
      anyRawContains(event, [
        "mimikatz",
        "sekurlsa",
        "lsass",
        "procdump",
        "comsvcs.dll",
        "minidump",
      ]),
    description: () =>
      "Potential credential dumping activity detected.",
  },

  {
    id: "lsass-memory",
    tactic: "Credential Access",
    techniqueId: "T1003.001",
    techniqueName: "LSASS Memory",
    severity: "CRITICAL",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "lsass.exe",
        "procdump.exe",
        "comsvcs.dll",
        "rundll32.exe c:\\windows\\system32\\comsvcs.dll",
      ]),
    description: () =>
      "Potential LSASS memory access or dumping detected.",
  },

  {
    id: "brute-force",
    tactic: "Credential Access",
    techniqueId: "T1110",
    techniqueName: "Brute Force",
    severity: "MEDIUM",
    confidence: "MEDIUM",
    match: (event) =>
      eventTypeIs(event, "LOGON_FAILURE") ||
      rawContains(event, "4625") ||
      rawContains(event, "failed logon"),
    description: () =>
      "Failed authentication activity detected.",
  },

  {
    id: "system-info-discovery",
    tactic: "Discovery",
    techniqueId: "T1082",
    techniqueName: "System Information Discovery",
    severity: "LOW",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "systeminfo",
        "hostname",
        "whoami",
        "ipconfig",
      ]),
    description: () =>
      "System information discovery command detected.",
  },

  {
    id: "account-discovery",
    tactic: "Discovery",
    techniqueId: "T1087",
    techniqueName: "Account Discovery",
    severity: "MEDIUM",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "net user",
        "net group",
        "net localgroup",
        "whoami /groups",
      ]),
    description: () =>
      "Account or group discovery activity detected.",
  },

  {
    id: "network-discovery",
    tactic: "Discovery",
    techniqueId: "T1046",
    techniqueName: "Network Service Discovery",
    severity: "MEDIUM",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "net view",
        "nltest",
        "arp -a",
        "nslookup",
        "ping ",
        "nmap",
      ]),
    description: () =>
      "Network discovery activity detected.",
  },

  {
    id: "psexec",
    tactic: "Lateral Movement",
    techniqueId: "T1569.002",
    techniqueName: "Service Execution",
    severity: "HIGH",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "psexec",
        "psexesvc",
        "admin$",
      ]),
    description: () =>
      "Possible PsExec or service-based lateral movement detected.",
  },

  {
    id: "remote-service",
    tactic: "Lateral Movement",
    techniqueId: "T1021",
    techniqueName: "Remote Services",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "wmic /node",
        "winrm",
        "evil-winrm",
        "mstsc.exe",
        "remote desktop",
      ]),
    description: () =>
      "Remote service usage associated with lateral movement detected.",
  },

  {
    id: "archive-collected-data",
    tactic: "Collection",
    techniqueId: "T1560",
    techniqueName: "Archive Collected Data",
    severity: "MEDIUM",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "7z.exe",
        "rar.exe",
        "winrar",
        "compress-archive",
        ".zip",
      ]),
    description: () =>
      "Potential archiving of collected data detected.",
  },

  {
    id: "screen-capture",
    tactic: "Collection",
    techniqueId: "T1113",
    techniqueName: "Screen Capture",
    severity: "MEDIUM",
    confidence: "LOW",
    match: (event) =>
      anyRawContains(event, [
        "screenshot",
        "screen capture",
        "printscreen",
      ]),
    description: () =>
      "Possible screen capture behavior detected.",
  },

  {
    id: "certutil-download",
    tactic: "Command and Control",
    techniqueId: "T1105",
    techniqueName: "Ingress Tool Transfer",
    severity: "HIGH",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "certutil.exe",
        "-urlcache",
        "bitsadmin",
        "invoke-webrequest",
        "curl.exe",
        "wget.exe",
      ]),
    description: () =>
      "Tool download or ingress transfer detected.",
  },

  {
    id: "encoded-command-c2",
    tactic: "Command and Control",
    techniqueId: "T1027",
    techniqueName: "Obfuscated Files or Information",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "-encodedcommand",
        "frombase64string",
        "base64",
      ]),
    description: () =>
      "Encoded or obfuscated command content detected.",
  },

  {
    id: "exfil-web-service",
    tactic: "Exfiltration",
    techniqueId: "T1567",
    techniqueName: "Exfiltration Over Web Service",
    severity: "HIGH",
    confidence: "MEDIUM",
    match: (event) =>
      anyRawContains(event, [
        "rclone",
        "mega.nz",
        "dropbox",
        "google drive",
        "onedrive",
      ]),
    description: () =>
      "Potential exfiltration over web/cloud service detected.",
  },

  {
    id: "exfil-network",
    tactic: "Exfiltration",
    techniqueId: "T1041",
    techniqueName: "Exfiltration Over C2 Channel",
    severity: "HIGH",
    confidence: "LOW",
    match: (event) =>
      anyRawContains(event, [
        "ftp.exe",
        "scp.exe",
        "sftp",
        "curl -x",
      ]),
    description: () =>
      "Potential network-based exfiltration behavior detected.",
  },

  {
    id: "ransomware-behavior",
    tactic: "Impact",
    techniqueId: "T1486",
    techniqueName: "Data Encrypted for Impact",
    severity: "CRITICAL",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "ransom",
        "encrypt",
        ".locked",
        ".lockbit",
        "vssadmin delete shadows",
        "bcdedit /set",
        "wbadmin delete catalog",
      ]),
    description: () =>
      "Potential ransomware or destructive encryption behavior detected.",
  },

  {
    id: "inhibit-system-recovery",
    tactic: "Impact",
    techniqueId: "T1490",
    techniqueName: "Inhibit System Recovery",
    severity: "CRITICAL",
    confidence: "HIGH",
    match: (event) =>
      anyRawContains(event, [
        "vssadmin delete shadows",
        "wmic shadowcopy delete",
        "wbadmin delete",
        "bcdedit /set recoveryenabled no",
      ]),
    description: () =>
      "System recovery inhibition detected.",
  },
];