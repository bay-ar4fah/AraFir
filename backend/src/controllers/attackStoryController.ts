import { Request, Response } from "express";

import {
  getTimelineByCaseId,
} from "../services/timelineService";

import {
  getMitreFindingsByCaseId,
} from "../services/mitreFindingService";

import {
  generateAttackStory,
} from "../services/attackStoryService";

export async function getAttackStoryByCase(
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

    const timeline =
      await getTimelineByCaseId(caseId);

    const mitre =
      await getMitreFindingsByCaseId(caseId);

    const story = generateAttackStory({
      caseId,
      timeline,
      mitre,
    });

    return res.json(story);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to generate attack story",
    });
  }
}