import type {
  Edge,
  Node,
} from "@xyflow/react";

import type {
  Case,
} from "../types/case";

import type {
  Evidence,
} from "../types/evidence";

import type {
  TimelineEvent,
} from "../types/timeline";

import type {
  MitreFinding,
} from "../types/mitreFinding";

import type {
  AttackGraphNodeData,
  AttackGraphEdgeData,
} from "../types/attackGraph";

type GraphNode = Node<AttackGraphNodeData>;
type GraphEdge = Edge<AttackGraphEdgeData>;

function severityRank(
  severity?: string
): number {
  if (severity === "CRITICAL") return 4;
  if (severity === "HIGH") return 3;
  if (severity === "MEDIUM") return 2;
  if (severity === "LOW") return 1;
  return 0;
}

function nodeColorClass(type: string) {
  if (type === "CASE") return "case";
  if (type === "EVIDENCE") return "evidence";
  if (type === "TIMELINE") return "timeline";
  if (type === "MITRE") return "mitre";
  return "tactic";
}

export function buildAttackGraph(params: {
  caseData: Case;
  evidence: Evidence[];
  timeline: TimelineEvent[];
  mitreFindings: MitreFinding[];
}): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const {
    caseData,
    evidence,
    timeline,
    mitreFindings,
  } = params;

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  nodes.push({
    id: `case-${caseData.id}`,
    type: "default",
    position: {
      x: 0,
      y: 0,
    },
    data: {
      label: caseData.caseName,
      subtitle: "Investigation Case",
      type: "CASE",
    },
    className: nodeColorClass("CASE"),
  });

  evidence.forEach((item, index) => {
    nodes.push({
      id: `evidence-${item.id}`,
      type: "default",
      position: {
        x: 320,
        y: index * 160,
      },
      data: {
        label: item.filename,
        subtitle: item.fileType,
        type: "EVIDENCE",
      },
      className: nodeColorClass("EVIDENCE"),
    });

    edges.push({
      id: `case-to-evidence-${item.id}`,
      source: `case-${caseData.id}`,
      target: `evidence-${item.id}`,
      label: "contains",
      data: {
        label: "contains",
      },
      animated: false,
    });
  });

  timeline.forEach((event, index) => {
    nodes.push({
      id: `timeline-${event.id}`,
      type: "default",
      position: {
        x: 680,
        y: index * 150,
      },
      data: {
        label: event.eventType,
        subtitle: event.description,
        severity: event.severity,
        type: "TIMELINE",
      },
      className: nodeColorClass("TIMELINE"),
    });

    edges.push({
      id: `evidence-to-event-${event.id}`,
      source: `evidence-${event.evidenceId}`,
      target: `timeline-${event.id}`,
      label: "generated",
      data: {
        label: "generated",
      },
      animated:
        severityRank(event.severity) >= 3,
    });
  });

  const uniqueMitre =
    new Map<string, MitreFinding>();

  mitreFindings.forEach((finding) => {
    const current =
      uniqueMitre.get(finding.techniqueId);

    if (
      !current ||
      severityRank(finding.severity) >
        severityRank(current.severity)
    ) {
      uniqueMitre.set(
        finding.techniqueId,
        finding
      );
    }
  });

  Array.from(uniqueMitre.values()).forEach(
    (finding, index) => {
      nodes.push({
        id: `mitre-${finding.techniqueId}`,
        type: "default",
        position: {
          x: 1040,
          y: index * 170,
        },
        data: {
          label: finding.techniqueId,
          subtitle: finding.techniqueName,
          severity: finding.severity,
          type: "MITRE",
        },
        className: nodeColorClass("MITRE"),
      });
    }
  );

  mitreFindings.forEach((finding) => {
    edges.push({
      id: `event-to-mitre-${finding.id}`,
      source: `timeline-${finding.timelineEventId}`,
      target: `mitre-${finding.techniqueId}`,
      label: "mapped_to",
      data: {
        label: "mapped_to",
      },
      animated:
        severityRank(finding.severity) >= 3,
    });
  });

  const tactics =
    new Set(
      mitreFindings.map(
        (finding) => finding.tactic
      )
    );

  Array.from(tactics).forEach(
    (tactic, index) => {
      nodes.push({
        id: `tactic-${tactic}`,
        type: "default",
        position: {
          x: 1400,
          y: index * 190,
        },
        data: {
          label: tactic,
          subtitle: "MITRE Tactic",
          type: "TACTIC",
        },
        className: nodeColorClass("TACTIC"),
      });
    }
  );

  Array.from(uniqueMitre.values()).forEach(
    (finding) => {
      edges.push({
        id: `mitre-to-tactic-${finding.techniqueId}`,
        source: `mitre-${finding.techniqueId}`,
        target: `tactic-${finding.tactic}`,
        label: "belongs_to",
        data: {
          label: "belongs_to",
        },
      });
    }
  );

  return {
    nodes,
    edges,
  };
}