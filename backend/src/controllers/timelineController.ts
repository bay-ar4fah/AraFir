import { Request, Response } from "express";

import {
  getTimelineByCaseId,
} from "../services/timelineService";

export async function listTimelineByCase(
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

    const data = await getTimelineByCaseId(caseId);

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load timeline",
    });
  }
}