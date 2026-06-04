import { getEvidenceList } from "./evidenceService";
import { getCustodyLogs } from "./chainOfCustodyService";

export async function buildAttackGraph() {
  const evidence = await getEvidenceList();
  const logs = await getCustodyLogs();

  const nodes = evidence.map((e) => ({
    id: e.id,
    data: {
      label: e.filename,
    },
    position: {
      x: Math.random() * 400,
      y: Math.random() * 400,
    },
  }));

  const edges = logs.map((log, index) => ({
    id: `edge-${index}`,
    source: log.evidenceId,
    target: log.evidenceId,
  }));

  return {
    nodes,
    edges,
  };
}