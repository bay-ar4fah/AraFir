import { Request, Response } from "express";

import {
  getCustodyLogsByCaseId,
  getCustodyLogsByEvidenceId,
} from "../services/custodyService";

export async function listCustodyByCase(
  req: Request,
  res: Response
) {
  try {
    const caseId = req.params.caseId;

    if (!caseId || Array.isArray(caseId)) {
      return res.status(400).json({
        error: "Invalid case id",
      });
    }

    const data =
      await getCustodyLogsByCaseId(caseId);

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load custody logs",
    });
  }
}

export async function listCustodyByEvidence(
  req: Request,
  res: Response
) {
  try {
    const evidenceId = req.params.evidenceId;

    if (
      !evidenceId ||
      Array.isArray(evidenceId)
    ) {
      return res.status(400).json({
        error: "Invalid evidence id",
      });
    }

    const data =
      await getCustodyLogsByEvidenceId(evidenceId);

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load evidence custody logs",
    });
  }
}