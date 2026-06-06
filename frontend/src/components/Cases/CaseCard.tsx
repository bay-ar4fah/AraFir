import type { Case } from "../../types/case";

interface Props {
  forensicCase: Case;
}

export default function CaseCard({
  forensicCase,
}: Props) {
  const statusColor =
    forensicCase.status === "OPEN"
      ? "bg-green-500/20 text-green-400"
      : forensicCase.status === "CLOSED"
      ? "bg-zinc-500/20 text-zinc-300"
      : "bg-yellow-500/20 text-yellow-400";

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-cyan-600 transition">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {forensicCase.caseName}
          </h2>

          <p className="text-sm text-zinc-400 mt-1">
            {forensicCase.description}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColor}`}
        >
          {forensicCase.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
        <div>
          <p className="text-zinc-500">Investigator</p>
          <p>{forensicCase.investigator}</p>
        </div>

        <div>
          <p className="text-zinc-500">Created</p>
          <p>{forensicCase.createdAt}</p>
        </div>
      </div>
    </div>
  );
}