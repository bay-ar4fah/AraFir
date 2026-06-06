import { Request, Response } from "express";

import {
  getSystemStatus,
} from "../services/statusService";

export async function systemStatus(
  _req: Request,
  res: Response
) {
  try {
    const status = await getSystemStatus();

    return res.json(status);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: "OFFLINE",
      database: "ERROR",
      error: "Failed to load system status",
    });
  }
}