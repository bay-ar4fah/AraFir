import { useEffect, useState } from "react";

import type { Case } from "../../types/case";
import CaseCard from "../../components/Cases/CaseCard";
import CreateCaseModal from "../../components/Cases/CreateCaseModal";

import {
  createCase,
  getCases,
} from "../../services/caseService";

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCases = async () => {
    const data = await getCases();
    setCases(data);
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleCreateCase = async (
    forensicCase: Case
  ) => {
    await createCase(forensicCase);
    await loadCases();
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Investigation Cases
          </h1>

          <p className="text-zinc-400">
            Manage local DFIR investigation cases.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700"
        >
          + New Case
        </button>
      </div>

      {cases.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-10 text-center text-zinc-400">
          No investigation cases found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {cases.map((item) => (
            <CaseCard
              key={item.id}
              forensicCase={item}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CreateCaseModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateCase}
        />
      )}
    </div>
  );
}