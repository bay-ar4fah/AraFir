import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EvidenceImagingForm from "../../components/EvidenceImaging/EvidenceImagingForm";
import EvidenceImagingSummaryCards from "../../components/EvidenceImaging/EvidenceImagingSummaryCards";
import EvidenceImagingTable from "../../components/EvidenceImaging/EvidenceImagingTable";

import {
  createEvidenceImageRecord,
  getEvidenceImages,
  updateEvidenceImageRecordStatus,
} from "../../services/evidenceImagingService";

import type {
  CreateEvidenceImagePayload,
  EvidenceImageRecord,
  EvidenceImagingStatus,
} from "../../types/evidenceImaging";

export default function EvidenceImagingWorkspace() {
  const { caseId } = useParams<{ caseId: string }>();
  const [records, setRecords] = useState<EvidenceImageRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRecords = async () => {
    if (!caseId) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getEvidenceImages(caseId);
      setRecords(data);
    } catch {
      setErrorMessage("Failed to load evidence imaging records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [caseId]);

  const handleCreate = async (
    payload: CreateEvidenceImagePayload
  ) => {
    if (!caseId) return;

    await createEvidenceImageRecord(caseId, payload);
    await loadRecords();
  };

  const handleStatusChange = async (
    imageId: number,
    status: EvidenceImagingStatus
  ) => {
    if (!caseId) return;

    await updateEvidenceImageRecordStatus(caseId, imageId, status);
    await loadRecords();
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

        <h1 className="mt-1 text-3xl font-bold text-zinc-50">
          Evidence Imaging
        </h1>

        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Manage forensic acquisition records, source media, imaging format,
          hash verification, acquisition tools, and chain-of-custody-ready
          metadata.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 text-sm text-zinc-400">
          Loading evidence imaging records...
        </div>
      ) : (
        <>
          <EvidenceImagingSummaryCards records={records} />

          <EvidenceImagingForm onSubmit={handleCreate} />

          <EvidenceImagingTable
            records={records}
            onStatusChange={handleStatusChange}
          />
        </>
      )}
    </div>
  );
}