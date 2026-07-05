import { useState } from "react";
import type {
  CreateMemoryArtifactPayload,
  MemoryArtifactType,
  MemorySeverity,
} from "../../types/memory";

interface MemoryArtifactFormProps {
  onSubmit: (payload: CreateMemoryArtifactPayload) => Promise<void>;
}

const artifactTypes: MemoryArtifactType[] = [
  "PROCESS",
  "NETWORK_CONNECTION",
  "DLL_MODULE",
  "COMMAND_LINE",
  "INJECTION",
  "MALWARE_INDICATOR",
  "REGISTRY",
  "HANDLE",
  "YARA_MATCH",
  "OTHER",
];

const severities: MemorySeverity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function MemoryArtifactForm({ onSubmit }: MemoryArtifactFormProps) {
  const [artifactType, setArtifactType] =
    useState<MemoryArtifactType>("PROCESS");
  const [name, setName] = useState("");
  const [processName, setProcessName] = useState("");
  const [pid, setPid] = useState("");
  const [commandLine, setCommandLine] = useState("");
  const [severity, setSeverity] = useState<MemorySeverity>("LOW");
  const [mitreTechnique, setMitreTechnique] = useState("");
  const sourceTool = "Manual";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        artifactType,
        name: name.trim(),
        processName: processName || undefined,
        pid: pid ? Number(pid) : undefined,
        commandLine: commandLine || undefined,
        severity,
        mitreTechnique: mitreTechnique || undefined,
        sourceTool,
        confidence: 70,
      });

      setName("");
      setProcessName("");
      setPid("");
      setCommandLine("");
      setMitreTechnique("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <h3 className="mb-4 text-sm font-semibold text-zinc-100">
        Add Memory Artifact
      </h3>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <select
          value={artifactType}
          onChange={(event) =>
            setArtifactType(event.target.value as MemoryArtifactType)
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        >
          {artifactTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>

        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Artifact name"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />

        <input
          value={processName}
          onChange={(event) => setProcessName(event.target.value)}
          placeholder="Process name"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />

        <input
          value={pid}
          onChange={(event) => setPid(event.target.value)}
          placeholder="PID"
          type="number"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />

        <input
          value={commandLine}
          onChange={(event) => setCommandLine(event.target.value)}
          placeholder="Command line"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 xl:col-span-2"
        />

        <input
          value={mitreTechnique}
          onChange={(event) => setMitreTechnique(event.target.value)}
          placeholder="MITRE Technique, e.g. T1055"
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        />

        <select
          value={severity}
          onChange={(event) =>
            setSeverity(event.target.value as MemorySeverity)
          }
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100"
        >
          {severities.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !name.trim()}
        className="mt-4 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Artifact"}
      </button>
    </div>
  );
}