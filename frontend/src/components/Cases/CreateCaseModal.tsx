import { useState } from "react";
import type { Case } from "../../types/case";

interface Props {
  onClose: () => void;
  onCreate: (forensicCase: Case) => void;
}

export default function CreateCaseModal({
  onClose,
  onCreate,
}: Props) {
  const [caseName, setCaseName] = useState("");
  const [description, setDescription] = useState("");
  const [investigator, setInvestigator] = useState("");

  const handleSubmit = () => {
    if (!caseName || !investigator) {
      alert("Case name and investigator are required");
      return;
    }

    onCreate({
      id: crypto.randomUUID(),
      caseName,
      description,
      investigator,
      createdAt: new Date().toISOString(),
      status: "OPEN",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl w-[520px] p-6">
        <h2 className="text-2xl font-bold mb-4">
          New Investigation Case
        </h2>

        <div className="space-y-4">
          <input
            value={caseName}
            onChange={(e) => setCaseName(e.target.value)}
            placeholder="Case name"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Case description"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none h-28"
          />

          <input
            value={investigator}
            onChange={(e) => setInvestigator(e.target.value)}
            placeholder="Lead investigator"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700"
          >
            Create Case
          </button>
        </div>
      </div>
    </div>
  );
}