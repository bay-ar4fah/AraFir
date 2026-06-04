import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

export default function AttackGraphView({
  nodes,
  edges,
}: any) {
  return (
    <div className="h-[700px] bg-zinc-900 rounded-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />
    </div>
  );
}