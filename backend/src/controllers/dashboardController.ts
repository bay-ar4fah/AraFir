import { Request, Response } from "express";

import {
  getInvestigationDashboard,
} from "../services/dashboardService";

export async function getDashboard(
  _req: Request,
  res: Response
) {
  try {
    const data =
      await getInvestigationDashboard();

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
}