import type {
  MitreTechnique,
} from "../types/mitre";

import type {
  AttackChain,
} from "../types/correlation";

export function correlateTechniques(
  techniques: MitreTechnique[]
): AttackChain[] {

  const ids =
    techniques.map((t) => t.id);

  const chain: AttackChain = {
    id: crypto.randomUUID(),

    confidence: 90,

    chain: [],
  };

  if (ids.includes("T1059")) {

    chain.chain.push({
      techniqueId: "T1059",
      techniqueName:
        "Command and Scripting Interpreter",
      tactic: "Execution",
    });

  }

  if (ids.includes("T1003")) {

    chain.chain.push({
      techniqueId: "T1003",
      techniqueName:
        "Credential Dumping",
      tactic: "Credential Access",
    });

  }

  if (ids.includes("T1041")) {

    chain.chain.push({
      techniqueId: "T1041",
      techniqueName:
        "Exfiltration Over C2",
      tactic: "Exfiltration",
    });

  }

  return [chain];
}