import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import type { Case } from "../../types/case";
import type { Evidence } from "../../types/evidence";
import type { TimelineEvent } from "../../types/timeline";
import type { MitreFinding } from "../../types/mitreFinding";

import type {
  AttackGraphEdgeData,
  AttackGraphNodeData,
} from "../../types/attackGraph";

import { getCaseById } from "../../services/caseService";

import {
  getEvidenceByCaseId,
} from "../../services/evidenceService";

import {
  getTimelineByCaseId,
} from "../../services/timelineService";

import {
  getMitreFindingsByCaseId,
} from "../../services/mitreFindingService";

import {
  buildAttackGraph,
} from "../../services/attackGraphBuilder";

import AttackGraphNode
from "../../components/AttackGraph/AttackGraphNode";

const nodeTypes = {
  default: AttackGraphNode,
};

export default function CaseAttackGraph() {
  const { caseId } = useParams();

  const [caseData, setCaseData] =
    useState<Case | null>(null);

  const [evidence, setEvidence] =
    useState<Evidence[]>([]);

  const [timeline, setTimeline] =
    useState<TimelineEvent[]>([]);

  const [mitreFindings, setMitreFindings] =
    useState<MitreFinding[]>([]);

  useEffect(() => {
    if (!caseId) return;

    getCaseById(caseId).then(setCaseData);
    getEvidenceByCaseId(caseId).then(setEvidence);
    getTimelineByCaseId(caseId).then(setTimeline);
    getMitreFindingsByCaseId(caseId)
      .then(setMitreFindings);
  }, [caseId]);

  const graph = useMemo(() => {
    if (!caseData) {
        return {
        nodes: [] as Node<AttackGraphNodeData, string | undefined>[],
        edges: [] as Edge<AttackGraphEdgeData, string | undefined>[],
        };
    }

    return buildAttackGraph({
        caseData,
        evidence,
        timeline,
        mitreFindings,
    });
    }, [
    caseData,
    evidence,
    timeline,
    mitreFindings,
    ]);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 text-zinc-400">
        Loading attack graph...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 space-y-6">
      <div className="bg-black border border-zinc-800 border-l-4 border-l-cyan-500 rounded-xl p-6">
        <h1 className="text-3xl font-bold">
          Attack Graph
        </h1>

        <p className="text-zinc-400 mt-2">
          Auto-generated relationship map for{" "}
          <span className="text-cyan-400">
            {caseData.caseName}
          </span>
        </p>

        <div className="grid grid-cols-4 gap-4 mt-6 text-sm">
          <div>
            <p className="text-zinc-500">
              Evidence
            </p>
            <p>{evidence.length}</p>
          </div>

          <div>
            <p className="text-zinc-500">
              Timeline Events
            </p>
            <p>{timeline.length}</p>
          </div>

          <div>
            <p className="text-zinc-500">
              MITRE Findings
            </p>
            <p>{mitreFindings.length}</p>
          </div>

          <div>
            <p className="text-zinc-500">
              Graph Nodes
            </p>
            <p>{graph.nodes.length}</p>
          </div>
        </div>
      </div>

      <div className="h-[720px] rounded-xl overflow-hidden border border-zinc-800 bg-black">
        <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        nodeTypes={nodeTypes}
        fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}