import { Request, Response } from "express";

import {
  getAuditLogs,
  getAuditLogsByCaseId,
} from "../services/auditService";

export async function listAuditLogs(
  _req: Request,
  res: Response
) {
  try {
    const logs = await getAuditLogs();
    return res.json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to load audit logs",
    });
  }
}

export async function listAuditLogsByCase(
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

    const logs =
      await getAuditLogsByCaseId(caseId);

    return res.json(logs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to load case audit logs",
    });
  }
}