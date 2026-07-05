import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MemoryArtifactForm from "../../components/Memory/MemoryArtifactForm";
import MemoryArtifactTable from "../../components/Memory/MemoryArtifactTable";
import MemorySummaryCards from "../../components/Memory/MemorySummaryCards";
import {
  createMemoryArtifact,
  getMemoryArtifacts,
  getMemorySummary,
  markMemoryArtifactFalsePositive,
  reviewMemoryArtifact,
} from "../../services/memoryService";
import type {
  CreateMemoryArtifactPayload,
  MemoryArtifact,
  MemorySummary,
} from "../../types/memory";

const emptySummary: MemorySummary = {
  totalArtifacts: 0,
  processCount: 0,
  networkCount: 0,
  suspiciousCount: 0,
  criticalCount: 0,
  promotedFindings: 0,
};

export default function MemoryWorkspace() {
  const { caseId } = useParams();
  const [summary, setSummary] = useState<MemorySummary>(emptySummary);
  const [artifacts, setArtifacts] = useState<MemoryArtifact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadMemoryWorkspace = async () => {
    if (!caseId) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const [summaryData, artifactData] = await Promise.all([
        getMemorySummary(caseId),
        getMemoryArtifacts(caseId),
      ]);

      setSummary(summaryData);
      setArtifacts(artifactData);
    } catch {
      setErrorMessage("Failed to load memory workspace.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMemoryWorkspace();
  }, [caseId]);

  const handleCreateArtifact = async (
    payload: CreateMemoryArtifactPayload
  ) => {
    if (!caseId) return;

    await createMemoryArtifact(caseId, payload);
    await loadMemoryWorkspace();
  };

  const handleReview = async (artifactId: number) => {
    if (!caseId) return;

    await reviewMemoryArtifact(caseId, artifactId);
    await loadMemoryWorkspace();
  };

  const handleFalsePositive = async (artifactId: number) => {
    if (!caseId) return;

    await markMemoryArtifactFalsePositive(caseId, artifactId);
    await loadMemoryWorkspace();
  };

  if (!caseId) {
    return (
      <div className="p-6 text-sm text-red-400">
        Invalid case ID.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-zinc-500">
          Case #{caseId}
        </p>
        <h1 className="text-2xl font-semibold text-zinc-100">
          Memory Workspace
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Analyze memory artifacts, suspicious processes, injected code,
          command lines, and network traces from memory evidence.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
          Loading memory workspace...
        </div>
      ) : (
        <>
          <MemorySummaryCards summary={summary} />

          <MemoryArtifactForm onSubmit={handleCreateArtifact} />

          <MemoryArtifactTable
            artifacts={artifacts}
            onReview={handleReview}
            onFalsePositive={handleFalsePositive}
          />
        </>
      )}
    </div>
  );
}