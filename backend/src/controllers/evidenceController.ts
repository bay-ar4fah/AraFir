import { Request, Response } from "express";

import {
  getEvidence,
  createEvidence,
  getEvidenceByCaseId,
} from "../services/evidenceService";

import {
  excludeEvidence,
  restoreEvidence,
} from "../services/evidenceService";

import {
  createCustodyLog,
} from "../services/custodyService";

export async function listEvidence(
  _req: Request,
  res: Response
) {
  try {
    const data = await getEvidence();

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load evidence",
    });
  }
}

export async function addEvidence(
  req: Request,
  res: Response
) {
  try {
    await createEvidence(req.body);

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to save evidence",
    });
  }
}

export async function listEvidenceByCase(
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

    const data = await getEvidenceByCaseId(caseId);

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load case evidence",
    });
  }
}

export async function excludeEvidenceById(
  req: Request,
  res: Response
) {
  try {
    const evidenceId = req.params.evidenceId;
    const {
      caseId,
      reason,
      user,
    } = req.body;

    if (!evidenceId || Array.isArray(evidenceId)) {
      return res.status(400).json({
        error: "Invalid evidence id",
      });
    }

    if (!caseId || !reason) {
      return res.status(400).json({
        error: "caseId and reason are required",
      });
    }

    await excludeEvidence({
      evidenceId,
      excludedBy: user || "Investigator",
      reason,
    });

    await createCustodyLog({
      caseId,
      evidenceId,
      action: "EXCLUDE",
      user: user || "Investigator",
      reason,
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to exclude evidence",
    });
  }
}

export async function restoreEvidenceById(
  req: Request,
  res: Response
) {
  try {
    const evidenceId = req.params.evidenceId;
    const {
      caseId,
      user,
      reason,
    } = req.body;

    if (!evidenceId || Array.isArray(evidenceId)) {
      return res.status(400).json({
        error: "Invalid evidence id",
      });
    }

    if (!caseId) {
      return res.status(400).json({
        error: "caseId is required",
      });
    }

    await restoreEvidence(evidenceId);

    await createCustodyLog({
      caseId,
      evidenceId,
      action: "RESTORE",
      user: user || "Investigator",
      reason,
    });

    return res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to restore evidence",
    });
  }
}