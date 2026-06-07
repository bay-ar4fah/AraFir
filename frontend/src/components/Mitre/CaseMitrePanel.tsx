import type {
  MitreFinding,
} from "../../types/mitreFinding";

interface Props {
  findings: MitreFinding[];
}

export default function CaseMitrePanel({
  findings,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-md shadow-black/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">
            MITRE ATT&CK Mapping
          </h2>

          <p className="text-zinc-400 text-sm">
            Techniques inferred from extracted timeline events.
          </p>
        </div>

        <span className="text-sm text-zinc-400">
          {findings.length} findings
        </span>
      </div>

      {findings.length === 0 ? (
        <p className="text-zinc-400">
          No MITRE techniques mapped yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {findings.map((item) => (
            <div
              key={item.id}
              className="bg-black border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-cyan-400">
                    {item.techniqueId}
                  </p>

                  <h3 className="font-semibold mt-1">
                    {item.techniqueName}
                  </h3>

                  <p className="text-sm text-zinc-400 mt-1">
                    {item.tactic}
                  </p>
                </div>

                <span className="px-2 py-1 rounded bg-zinc-800 text-xs text-yellow-400">
                  {item.confidence}
                </span>
              </div>

              <p className="text-xs text-zinc-500 mt-3">
                {item.description}
              </p>

              <div className="mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-500">
                Severity: {item.severity}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}