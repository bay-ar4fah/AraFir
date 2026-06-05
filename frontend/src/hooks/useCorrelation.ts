import {
  useEffect,
  useState,
} from "react";

import {
  getEvidenceList,
} from "../services/evidenceService";

import {
  mapEvidenceToMitre,
} from "../services/mitreService";

import {
  correlateTechniques,
} from "../services/correlationService";

import type {
  AttackChain,
} from "../types/correlation";

export function useCorrelation() {

  const [chains, setChains] =
    useState<AttackChain[]>([]);

  useEffect(() => {

    getEvidenceList().then(
      (evidence) => {

        const techniques =
          evidence.flatMap(
            mapEvidenceToMitre
          );

        const result =
          correlateTechniques(
            techniques
          );

        setChains(result);

      }
    );

  }, []);

  return {
    chains,
  };
}