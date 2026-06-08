import { useEffect, useState } from "react";

import type { Evidence } from "../../types/evidence";

import { getEvidenceList } from "../../services/evidenceService";

import EvidenceTable from "../../components/Evidence/EvidenceTable";
import EvidenceUploader from "../../components/Evidence/EvidenceUploader";

import { sha256File } from "../../utils/hash";

import { addCustodyLog } from "../../services/chainOfCustodyService";

import CustodyPanel from "../../components/Evidence/CustodyPanel";

import { STORAGE_KEYS } from "../../constants/storage";

import {
  saveData,
  loadData,
} from "../../services/storageService";

export default function EvidencePage() {
  const [evidence, setEvidence] =
    useState<Evidence[]>([]);

  useEffect(() => {
    const savedEvidence =
      loadData<Evidence[]>(
        STORAGE_KEYS.EVIDENCE,
        []
      );

    if (savedEvidence.length > 0) {
      setEvidence(savedEvidence);
    } else {
      getEvidenceList().then(setEvidence);
    }
  }, []);

  const handleFiles = async (
    files: FileList
  ) => {
    const newEvidence: Evidence[] =
      await Promise.all(
        Array.from(files).map(async (file) => {
          const evidenceId =
            crypto.randomUUID();

          const evidenceItem: Evidence = {
            id: evidenceId,
            caseId: "global",
            filename: file.name,
            fileType:
              file.name
                .split(".")
                .pop()
                ?.toUpperCase() ||
              "UNKNOWN",
            size: file.size,
            sha256: await sha256File(file),
            importedAt:
              new Date().toISOString(),
            importedBy: "Investigator",
          };

          await addCustodyLog({
            id: crypto.randomUUID(),
            caseId: "global",
            evidenceId: evidenceId,
            action: "IMPORT",
            timestamp: new Date().toISOString(),
            user: "Investigator",
          });

          return evidenceItem;
        })
      );

    setEvidence((prev) => {
      const updated = [
        ...prev,
        ...newEvidence,
      ];

      saveData(
        STORAGE_KEYS.EVIDENCE,
        updated
      );

      return updated;
    });
  };

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Evidence Repository
        </h1>

        <p className="text-zinc-400">
          Manage imported forensic evidence.
        </p>
      </div>

      <EvidenceUploader
        onSelect={handleFiles}
      />

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2">
          <EvidenceTable
            evidence={evidence}
          />
        </div>

        <div>
          <CustodyPanel />
        </div>

      </div>

    </div>
  );
}