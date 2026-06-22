import { Request, Response } from "express";

import {
  getCaseActivities,
} from "../services/caseActivityService";

export async function listCaseActivities(
  req: Request,
  res: Response
) {
  try {
    const { caseId } = req.params;

    if (!caseId || Array.isArray(caseId)) {
      return res.status(400).json({
        error: "Invalid case id",
      });
    }

    const activities =
      await getCaseActivities(caseId);

    return res.json(activities);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load case activities",
    });
  }
}