import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import type {
  AttackGraphNodeData,
} from "../../types/attackGraph";

function severityClass(
  severity?: string
) {
  if (severity === "CRITICAL") {
    return "text-red-400 border-red-500/30 bg-red-500/10";
  }

  if (severity === "HIGH") {
    return "text-orange-400 border-orange-500/30 bg-orange-500/10";
  }

  if (severity === "MEDIUM") {
    return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
  }

  return "text-green-400 border-green-500/30 bg-green-500/10";
}

function typeClass(
  type: string
) {
  if (type === "CASE") {
    return "border-cyan-500/50 bg-cyan-500/10";
  }

  if (type === "EVIDENCE") {
    return "border-blue-500/40 bg-blue-500/10";
  }

  if (type === "TIMELINE") {
    return "border-zinc-700 bg-black";
  }

  if (type === "MITRE") {
    return "border-orange-500/40 bg-orange-500/10";
  }

  return "border-purple-500/40 bg-purple-500/10";
}

export default function AttackGraphNode(
  props: NodeProps
) {
  const data =
    props.data as AttackGraphNodeData;

  return (
    <div
      className={`
        min-w-[220px]
        max-w-[280px]
        rounded-xl
        border
        p-4
        shadow-lg
        shadow-black/40
        text-white
        ${typeClass(data.type)}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-cyan-400"
      />

      <div className="text-[10px] uppercase tracking-widest text-zinc-500">
        {data.type}
      </div>

      <div className="font-bold mt-1 break-words">
        {data.label}
      </div>

      {data.subtitle && (
        <div className="text-xs text-zinc-400 mt-1 break-words">
          {data.subtitle}
        </div>
      )}

      {data.severity && (
        <div
          className={`
            inline-block
            mt-3
            rounded-md
            border
            px-2
            py-1
            text-xs
            font-semibold
            ${severityClass(data.severity)}
          `}
        >
          {data.severity}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-cyan-400"
      />
    </div>
  );
}