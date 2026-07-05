import type { MemoryArtifact } from "../../types/memory";

interface MemoryArtifactTableProps {
  artifacts: MemoryArtifact[];
  onReview: (artifactId: number) => void;
  onFalsePositive: (artifactId: number) => void;
}

const severityClass: Record<string, string> = {
  LOW: "bg-zinc-800 text-zinc-300",
  MEDIUM: "bg-yellow-500/10 text-yellow-300",
  HIGH: "bg-orange-500/10 text-orange-300",
  CRITICAL: "bg-red-500/10 text-red-300",
};

export default function MemoryArtifactTable({
  artifacts,
  onReview,
  onFalsePositive,
}: MemoryArtifactTableProps) {
  if (artifacts.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
        No memory artifacts found for this case.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-900 text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">PID</th>
            <th className="px-4 py-3">Command Line</th>
            <th className="px-4 py-3">MITRE</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-zinc-800 bg-zinc-950">
          {artifacts.map((artifact) => (
            <tr key={artifact.id} className="text-zinc-300">
              <td className="px-4 py-3">{artifact.artifactType}</td>
              <td className="px-4 py-3 font-medium text-zinc-100">
                {artifact.name}
              </td>
              <td className="px-4 py-3">{artifact.pid ?? "-"}</td>
              <td className="max-w-xs truncate px-4 py-3">
                {artifact.commandLine ?? "-"}
              </td>
              <td className="px-4 py-3">{artifact.mitreTechnique ?? "-"}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    severityClass[artifact.severity] ?? severityClass.LOW
                  }`}
                >
                  {artifact.severity}
                </span>
              </td>
              <td className="px-4 py-3">{artifact.status}</td>
              <td className="space-x-2 px-4 py-3 text-right">
                <button
                  onClick={() => onReview(artifact.id)}
                  className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  Review
                </button>
                <button
                  onClick={() => onFalsePositive(artifact.id)}
                  className="rounded-lg border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                >
                  FP
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}