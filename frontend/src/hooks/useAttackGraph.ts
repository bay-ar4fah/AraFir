import { useEffect, useState } from "react";
import type {
  Edge,
  Node,
} from "@xyflow/react";

export function useAttackGraph() {
  const [nodes, setNodes] =
    useState<Node[]>([]);

  const [edges, setEdges] =
    useState<Edge[]>([]);

  useEffect(() => {
    async function loadGraph() {
      const data = {
        nodes: [],
        edges: [],
      };

      setNodes(data.nodes);

      setEdges(
        data.edges.filter((edge: Edge) => {
          return edge.source && edge.target;
        })
      );
    }

    loadGraph();
  }, []);

  return {
    nodes,
    edges,
  };
}