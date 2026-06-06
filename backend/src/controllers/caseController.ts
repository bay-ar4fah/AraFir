import { Request, Response } from "express";

import {
  getCases,
  createCase
} from "../services/caseService";

export async function listCases(
  _req: Request,
  res: Response
) {
  try {
    const data = await getCases();
    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: "Failed to load cases"
    });
  }
}

export async function addCase(
  req: Request,
  res: Response
) {
  try {
    await createCase(req.body);

    res.status(201).json({
      success: true
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to create case"
    });
  }
}