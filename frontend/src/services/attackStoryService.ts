import type { AttackChain } from "../types/correlation";

export interface AttackNarrative {
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  confidence: number;
  summary: string;
  findings: string[];
  recommendations: string[];
}

function getSeverity(
  confidence: number
): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {

  if (confidence >= 90) {
    return "CRITICAL";
  }

  if (confidence >= 75) {
    return "HIGH";
  }

  if (confidence >= 50) {
    return "MEDIUM";
  }

  return "LOW";
}

export function generateNarrative(
  chain: AttackChain
): AttackNarrative {

  const severity =
    getSeverity(chain.confidence);

  const findings: string[] = [];

  const tactics =
    chain.chain.map(
      (node) => node.tactic
    );

  if (
    tactics.includes("Execution")
  ) {
    findings.push(
      "Execution activity was identified on the investigated host."
    );
  }

  if (
    tactics.includes(
      "Credential Access"
    )
  ) {
    findings.push(
      "Credential access techniques were observed, indicating possible attempts to obtain sensitive authentication material."
    );
  }

  if (
    tactics.includes(
      "Command and Control"
    )
  ) {
    findings.push(
      "Command-and-control behavior was detected, suggesting communication with an external system."
    );
  }

  if (
    tactics.includes(
      "Persistence"
    )
  ) {
    findings.push(
      "Persistence-related activity was detected, indicating an attempt to maintain long-term access."
    );
  }

  if (
    tactics.includes(
      "Privilege Escalation"
    )
  ) {
    findings.push(
      "Indicators of privilege escalation were identified."
    );
  }

  if (
    tactics.includes(
      "Defense Evasion"
    )
  ) {
    findings.push(
      "Defense evasion techniques were observed."
    );
  }

  if (
    tactics.includes(
      "Discovery"
    )
  ) {
    findings.push(
      "System discovery activity was detected."
    );
  }

  if (
    tactics.includes(
      "Lateral Movement"
    )
  ) {
    findings.push(
      "Potential lateral movement behavior was identified."
    );
  }

  if (
    tactics.includes(
      "Collection"
    )
  ) {
    findings.push(
      "Data collection activity was observed."
    );
  }

  if (
    tactics.includes(
      "Exfiltration"
    )
  ) {
    findings.push(
      "Potential data exfiltration activity was detected."
    );
  }

  const recommendations: string[] = [];

  if (
    tactics.includes(
      "Credential Access"
    )
  ) {
    recommendations.push(
      "Reset affected credentials and review privileged account activity."
    );
  }

  if (
    tactics.includes(
      "Command and Control"
    )
  ) {
    recommendations.push(
      "Investigate outbound connections and block malicious destinations."
    );
  }

  if (
    tactics.includes(
      "Exfiltration"
    )
  ) {
    recommendations.push(
      "Review outbound transfers and assess potential data exposure."
    );
  }

  if (
    tactics.includes(
      "Persistence"
    )
  ) {
    recommendations.push(
      "Inspect startup mechanisms, scheduled tasks, and registry persistence."
    );
  }

  const summary = `
The investigation identified ${
    chain.chain.length
  } correlated MITRE ATT&CK techniques.

Observed attack stages include:
${chain.chain
  .map((c) => `${c.techniqueId} (${c.tactic})`)
  .join(" → ")}

Threat severity has been assessed as ${severity}
with a confidence score of ${chain.confidence}%.
`.trim();

  return {
    title: "Attack Narrative",
    severity,
    confidence: chain.confidence,
    summary,
    findings,
    recommendations,
  };
}