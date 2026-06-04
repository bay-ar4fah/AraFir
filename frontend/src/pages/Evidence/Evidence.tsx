import { useEffect, useState } from "react";

import type { Evidence } from "../../types/evidence";

import { getEvidenceList }
from "../../services/evidenceService";

import EvidenceTable
from "../../components/Evidence/EvidenceTable";

export default function EvidencePage() {

  const [evidence, setEvidence] =
    useState<Evidence[]>([]);

  useEffect(() => {
    getEvidenceList().then(setEvidence);
  }, []);

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

      <EvidenceTable evidence={evidence} />

    </div>
  );
}