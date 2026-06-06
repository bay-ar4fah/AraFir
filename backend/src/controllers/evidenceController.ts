import { Request, Response } from "express";
import { getEvidence, createEvidence } from "../services/evidenceService";

export async function listEvidence(req: Request, res: Response) {
  try {
    const data = await getEvidence();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to load evidence" });
  }
}

export async function addEvidence(req: Request, res: Response) {
  try {
    await createEvidence(req.body);
    res.status(201).json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to save evidence" });
  }
}