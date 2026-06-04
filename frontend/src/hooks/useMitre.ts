import { useEffect, useState } from "react";

import type {
  MitreTechnique,
} from "../types/mitre";

import {
  getEvidenceList,
} from "../services/evidenceService";

import {
  mapEvidenceToMitre,
} from "../services/mitreService";

export function useMitre() {

  const [techniques, setTechniques] =
    useState<MitreTechnique[]>([]);

  useEffect(() => {

    getEvidenceList().then((evidence) => {

      const result =
        evidence.flatMap(
          mapEvidenceToMitre
        );

      setTechniques(result);

    });

  }, []);

  return {
    techniques,
  };
}