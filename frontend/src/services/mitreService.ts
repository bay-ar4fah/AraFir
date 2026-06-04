import mitreData from "../assets/mitre/mitre_attack.json";
import type { Evidence } from "../types/evidence";
import type { MitreTechnique } from "../types/mitre";

export function mapEvidenceToMitre(
  evidence: Evidence
): MitreTechnique[] {

  const matches: MitreTechnique[] = [];

  const filename =
    evidence.filename.toLowerCase();

  if (filename.includes("powershell")) {
    matches.push(
      mitreData.find(
        (t) => t.id === "T1059"
      )!
    );
  }

  if (
    filename.includes("lsass") ||
    filename.includes("memory")
  ) {
    matches.push(
      mitreData.find(
        (t) => t.id === "T1003"
      )!
    );
  }

  if (
    filename.includes("exfil") ||
    filename.includes("archive")
  ) {
    matches.push(
      mitreData.find(
        (t) => t.id === "T1041"
      )!
    );
  }

  return matches;
}