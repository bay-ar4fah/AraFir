import { Request, Response } from "express";

import {
  getMitreFindingsByCaseId,
} from "../services/mitreFindingService";

export async function listMitreFindingsByCase(
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
      await getMitreFindingsByCaseId(caseId);

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load MITRE findings",
    });
  }
}