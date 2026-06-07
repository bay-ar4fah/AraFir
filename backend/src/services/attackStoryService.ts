import type {
  AttackStory,
} from "../types/attackStory";

import type {
  TimelineEvent,
} from "../types/timeline";

import type {
  MitreFinding,
} from "../types/mitre";

function severityRank(
  severity: string
): number {
  if (severity === "CRITICAL") return 4;
  if (severity === "HIGH") return 3;
  if (severity === "MEDIUM") return 2;
  if (severity === "LOW") return 1;
  return 0;
}

function highestSeverity(
  timeline: TimelineEvent[],
  mitre: MitreFinding[]
): AttackStory["severity"] {
  const severities = [
    ...timeline.map((item) => item.severity),
    ...mitre.map((item) => item.severity),
  ];

  const highest = severities.sort(
    (a, b) =>
      severityRank(b) - severityRank(a)
  )[0];

  return (
    highest as AttackStory["severity"]
  ) || "LOW";
}

function buildExecutiveSummary(params: {
  timeline: TimelineEvent[];
  mitre: MitreFinding[];
  severity: AttackStory["severity"];
}): string {
  const uniqueTechniques =
    new Set(
      params.mitre.map(
        (finding) => finding.techniqueId
      )
    );

  if (
    params.timeline.length === 0 &&
    params.mitre.length === 0
  ) {
    return (
      "No suspicious activity has been identified yet. " +
      "The case currently has no extracted timeline events or MITRE ATT&CK mappings."
    );
  }

  return (
    `The investigation identified ${params.timeline.length} timeline event(s) ` +
    `and ${uniqueTechniques.size} MITRE ATT&CK technique(s). ` +
    `The current assessed severity is ${params.severity}. ` +
    "The activity should be reviewed in the context of the uploaded evidence, " +
    "timeline sequence, and mapped adversary behaviors."
  );
}

function buildAttackPath(
  timeline: TimelineEvent[]
) {
  return timeline
    .slice()
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
    )
    .slice(0, 10)
    .map((event, index) => ({
      title: `Step ${index + 1}: ${event.eventType}`,
      content:
        `${event.description || "Timeline event detected."} ` +
        `Source: ${event.source}. Severity: ${event.severity}.`,
    }));
}

function buildDetectedTechniques(
  mitre: MitreFinding[]
) {
  const unique = new Map<string, MitreFinding>();

  mitre.forEach((finding) => {
    if (!unique.has(finding.techniqueId)) {
      unique.set(finding.techniqueId, finding);
    }
  });

  return Array.from(unique.values()).map(
    (finding) => ({
      title:
        `${finding.techniqueId} - ${finding.techniqueName}`,
      content:
        `Tactic: ${finding.tactic}. ` +
        `Severity: ${finding.severity}. ` +
        `Confidence: ${finding.confidence}. ` +
        finding.description,
    })
  );
}

function buildRecommendedActions(
  severity: AttackStory["severity"],
  mitre: MitreFinding[]
): string[] {
  const actions = [
    "Validate the extracted timeline events against original evidence.",
    "Preserve uploaded evidence and maintain chain of custody records.",
    "Review related hosts, users, and processes for correlated activity.",
  ];

  const hasCredentialAccess =
    mitre.some(
      (finding) =>
        finding.tactic === "Credential Access"
    );

  const hasDefenseEvasion =
    mitre.some(
      (finding) =>
        finding.tactic === "Defense Evasion"
    );

  if (hasCredentialAccess) {
    actions.push(
      "Reset potentially exposed credentials and review privileged account activity."
    );
  }

  if (hasDefenseEvasion) {
    actions.push(
      "Review endpoint security controls and investigate possible evasion attempts."
    );
  }

  if (
    severity === "HIGH" ||
    severity === "CRITICAL"
  ) {
    actions.push(
      "Escalate the case for priority incident response and containment review."
    );
  }

  return actions;
}

export function generateAttackStory(params: {
  caseId: string;
  timeline: TimelineEvent[];
  mitre: MitreFinding[];
}): AttackStory {
  const severity = highestSeverity(
    params.timeline,
    params.mitre
  );

  return {
    caseId: params.caseId,
    severity,
    executiveSummary: buildExecutiveSummary({
      timeline: params.timeline,
      mitre: params.mitre,
      severity,
    }),
    attackPath: buildAttackPath(
      params.timeline
    ),
    detectedTechniques:
      buildDetectedTechniques(params.mitre),
    recommendedActions:
      buildRecommendedActions(
        severity,
        params.mitre
      ),
    generatedAt: new Date().toISOString(),
  };
}