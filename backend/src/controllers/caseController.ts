import { Request, Response } from "express";

import {
  getCases,
  createCase,
  getCaseById
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

export async function detailCase(
  req: Request,
  res: Response
) {
  try {
    const id = req.params.id;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid case id"
      });
    }

    const data = await getCaseById(id);

    if (!data) {
      return res.status(404).json({
        error: "Case not found"
      });
    }

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load case"
    });
  }
}