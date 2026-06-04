import { useEffect, useState } from "react";

import type {
  Node,
  Edge,
} from "reactflow";

import { buildAttackGraph }
from "../services/attackGraphService";

export function useAttackGraph() {

  const [nodes, setNodes] =
    useState<Node[]>([]);

  const [edges, setEdges] =
    useState<Edge[]>([]);

  useEffect(() => {

    buildAttackGraph().then((data) => {

      setNodes(data.nodes);

      setEdges(data.edges);

    });

  }, []);

  return {
    nodes,
    edges,
  };
}