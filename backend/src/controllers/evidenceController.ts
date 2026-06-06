import { Request, Response } from "express";

import {
  getEvidence,
  createEvidence,
  getEvidenceByCaseId,
} from "../services/evidenceService";

export async function listEvidence(
  _req: Request,
  res: Response
) {
  try {
    const data = await getEvidence();

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load evidence",
    });
  }
}

export async function addEvidence(
  req: Request,
  res: Response
) {
  try {
    await createEvidence(req.body);

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to save evidence",
    });
  }
}

export async function listEvidenceByCase(
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

    const data = await getEvidenceByCaseId(caseId);

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load case evidence",
    });
  }
}