import { Request, Response } from "express";

import {
  getCaseAttributionProjection,
  getCaseCardsAttributionProjection,
} from "../services/attributionProjectionService";

function getSingleParam(
  value: string | string[] | undefined
): string | null {
  if (!value || Array.isArray(value)) {
    return null;
  }

  return value;
}

export async function getCaseAttributionSummary(
  req: Request,
  res: Response
) {
  try {
    const caseId =
      getSingleParam(req.params.caseId);

    if (!caseId) {
      return res.status(400).json({
        message: "Invalid case id",
      });
    }

    const data =
      await getCaseAttributionProjection(caseId);

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to load attribution projection",
    });
  }
}

export async function getCaseCardsAttributionSummary(
  _req: Request,
  res: Response
) {
  try {
    const data =
      await getCaseCardsAttributionProjection();

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to load case attribution projection",
    });
  }
}