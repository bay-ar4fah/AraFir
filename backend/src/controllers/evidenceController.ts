import {
  getEvidence,
  createEvidence
}
from "../services/evidenceService";

import { Request, Response }
from "express";

export async function listEvidence(
  _req: Request,
  res: Response
) {

  try {

    const data =
      await getEvidence();

    res.json(data);

  } catch (error) {

  console.error(error);

  res.status(500).json({
    error:
      error instanceof Error
        ? error.message
        : "Unknown error"
  });

}

}

export async function addEvidence(
  req: Request,
  res: Response
) {

  try {

    await createEvidence(
      req.body
    );

    res.status(201).json({
      success: true
    });

  } catch {

    res
      .status(500)
      .json({
        error:
          "Failed to save evidence"
      });

  }

}