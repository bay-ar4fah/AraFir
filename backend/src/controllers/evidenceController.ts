import { Request, Response } from "express";

import {
  getEvidence,
  createEvidence,
  getEvidenceByCaseId,
  excludeEvidence,
  restoreEvidence,
} from "../services/evidenceService";

import {
  createCustodyLog,
} from "../services/custodyService";

import {
  createAuditLog,
} from "../services/auditService";

import {
  getAuditActor,
} from "../utils/auditUtils";

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
    const { caseId, reason } = req.body;

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

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

    const actor = `${req.user.name} (${req.user.role})`;

    await excludeEvidence({
      evidenceId,
      excludedBy: actor,
      reason,
    });
    
    await createAuditLog({
      ...getAuditActor(req),
      action: "EVIDENCE_EXCLUDED",
      entityType: "EVIDENCE",
      entityId: evidenceId,
      caseId,
      message: "Evidence excluded from active analysis",
      metadata: {
        reason,
      },
    });
    await createCustodyLog({
      caseId,
      evidenceId,
      action: "EXCLUDE",
      user: actor,
      reason,
    });

    return res.json({
      success: true,
      excludedBy: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      reason,
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
    const { caseId, reason } = req.body;

    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

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

    const actor = `${req.user.name} (${req.user.role})`;
    const restoreReason =
      reason?.trim() || "Evidence restored";

    await restoreEvidence(evidenceId);

    await createAuditLog({
      ...getAuditActor(req),
      action: "EVIDENCE_RESTORED",
      entityType: "EVIDENCE",
      entityId: evidenceId,
      caseId,
      message: "Evidence restored to active analysis",
      metadata: {
        reason: restoreReason,
      },
    });

    await createCustodyLog({
      caseId,
      evidenceId,
      action: "RESTORE",
      user: actor,
      reason: restoreReason,
    });

    return res.json({
      success: true,
      restoredBy: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      reason: restoreReason,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to restore evidence",
    });
  }
}