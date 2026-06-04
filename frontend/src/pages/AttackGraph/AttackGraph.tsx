import AttackGraphView from "../../components/AttackGraph/AttackGraphView";
import { useAttackGraph } from "../../hooks/useAttackGraph";

export default function AttackGraph() {
  const { nodes, edges } =
    useAttackGraph();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Attack Graph
      </h1>

      <AttackGraphView
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}