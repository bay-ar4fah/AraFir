import { useEffect, useState } from "react";

import type { Case } from "../../types/case";
import CaseCard from "../../components/Cases/CaseCard";
import CreateCaseModal from "../../components/Cases/CreateCaseModal";

import {
  createCase,
  getCases,
  deleteCaseById,
} from "../../services/caseService";

import PermissionGuard from "../../components/Auth/PermissionGuard";

import type {
  CaseCardAttributionProjection,
} from "../../types/attributionProjection";

import {
  getCaseCardsAttributionProjection,
} from "../../services/attributionProjectionService";

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const loadCases = async () => {
  const [caseData, attributionData] =
    await Promise.all([
      getCases(),
      getCaseCardsAttributionProjection(),
    ]);

  setCases(caseData);

  setAttributionByCaseId(
    Object.fromEntries(
      attributionData.map((item) => [
        item.caseId,
        item,
      ])
    )
  );
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

  const handleDeleteCase = async (
    caseId: string,
    caseName: string
  ) => {
    const confirmed = window.confirm(
      `Delete case "${caseName}" permanently? This will remove related evidence, timeline events, MITRE findings, and custody logs.`
    );

    if (!confirmed) return;

    try {
      await deleteCaseById(caseId);
      await loadCases();
      alert("Case deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete case.");
    }
  };

  const [
    attributionByCaseId,
    setAttributionByCaseId,
  ] = useState<
    Record<string, CaseCardAttributionProjection>
  >({});

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

        <PermissionGuard permission="case:create">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700"
          >
            + New Case
          </button>
        </PermissionGuard>
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
                attribution={attributionByCaseId[item.id]}
                onDelete={() =>
                  handleDeleteCase(item.id, item.caseName)
                }
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