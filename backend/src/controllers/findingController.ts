import { Request, Response } from "express";

import {
  createFinding,
  deleteFinding,
  getFindingById,
  getFindingsByCaseId,
  updateFinding,
  validateFindingConfidence,
  validateFindingSeverity,
  validateFindingStatus,
} from "../services/findingService";

import {
  createAuditLog,
} from "../services/auditService";

function getSingleParam(
  value: string | string[] | undefined
): string | null {
  if (!value || Array.isArray(value)) {
    return null;
  }

  return value;
}

export async function listCaseFindings(
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

    const findings =
      await getFindingsByCaseId(caseId);

    return res.json(findings);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to load findings",
    });
  }
}

export async function createCaseFinding(
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

    const {
      title,
      description,
      severity,
      confidence,
      evidenceId,
      timelineEventId,
      mitreFindingId,
      techniqueId,
      tactic,
    } = req.body;

    if (!title || !severity || !confidence) {
      return res.status(400).json({
        message:
          "title, severity, and confidence are required",
      });
    }

    if (!validateFindingSeverity(severity)) {
      return res.status(400).json({
        message: "Invalid finding severity",
      });
    }

    if (!validateFindingConfidence(confidence)) {
      return res.status(400).json({
        message: "Invalid finding confidence",
      });
    }

    const finding = await createFinding({
      caseId,
      title,
      description,
      severity,
      confidence,
      evidenceId,
      timelineEventId,
      mitreFindingId,
      techniqueId,
      tactic,
      createdBy: req.user!.id,
      createdByName: req.user!.name,
    });

    await createAuditLog({
        action: "FINDING_CREATED",
        status: "SUCCESS",
        message: "Finding created",
        actorUserId: req.user!.id,
        actorName: req.user!.name,
        actorEmail: req.user!.email,
        actorRole: req.user!.role,
        caseId,
        entityType: "FINDING",
        entityId: finding.id,
        entityName: finding.title,
        metadata: {
            severity: finding.severity,
            confidence: finding.confidence,
            status: finding.status,
        },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        });

    return res.status(201).json(finding);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to create finding",
    });
  }
}

export async function updateCaseFinding(
  req: Request,
  res: Response
) {
  try {
    const findingId =
      getSingleParam(req.params.findingId);

    if (!findingId) {
      return res.status(400).json({
        message: "Invalid finding id",
      });
    }

    const existing =
      await getFindingById(findingId);

    if (!existing) {
      return res.status(404).json({
        message: "Finding not found",
      });
    }

    const {
      title,
      description,
      severity,
      confidence,
      status,
      evidenceId,
      timelineEventId,
      mitreFindingId,
      techniqueId,
      tactic,
    } = req.body;

    if (
      severity &&
      !validateFindingSeverity(severity)
    ) {
      return res.status(400).json({
        message: "Invalid finding severity",
      });
    }

    if (
      confidence &&
      !validateFindingConfidence(confidence)
    ) {
      return res.status(400).json({
        message: "Invalid finding confidence",
      });
    }

    if (
      status &&
      !validateFindingStatus(status)
    ) {
      return res.status(400).json({
        message: "Invalid finding status",
      });
    }

    const shouldSetReviewer =
      status && status !== "OPEN";

    const updated =
      await updateFinding({
        id: findingId,
        title,
        description,
        severity,
        confidence,
        status,
        evidenceId,
        timelineEventId,
        mitreFindingId,
        techniqueId,
        tactic,
        reviewedBy: shouldSetReviewer
          ? req.user!.id
          : undefined,
        reviewedByName: shouldSetReviewer
          ? req.user!.name
          : undefined,
      });

    await createAuditLog({
        action: "FINDING_UPDATED",
        status: "SUCCESS",
        message: "Finding updated",
        actorUserId: req.user!.id,
        actorName: req.user!.name,
        actorEmail: req.user!.email,
        actorRole: req.user!.role,
        caseId: updated.caseId,
        entityType: "FINDING",
        entityId: updated.id,
        entityName: updated.title,
        metadata: {
            previousStatus: existing.status,
            currentStatus: updated.status,
            severity: updated.severity,
            confidence: updated.confidence,
        },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        });

    return res.json(updated);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to update finding",
    });
  }
}

export async function deleteCaseFinding(
  req: Request,
  res: Response
) {
  try {
    const findingId =
      getSingleParam(req.params.findingId);

    if (!findingId) {
      return res.status(400).json({
        message: "Invalid finding id",
      });
    }

    const existing =
      await getFindingById(findingId);

    if (!existing) {
      return res.status(404).json({
        message: "Finding not found",
      });
    }

    await deleteFinding(findingId);

    await createAuditLog({
        action: "FINDING_DELETED",
        status: "SUCCESS",
        message: "Finding deleted",
        actorUserId: req.user!.id,
        actorName: req.user!.name,
        actorEmail: req.user!.email,
        actorRole: req.user!.role,
        caseId: existing.caseId,
        entityType: "FINDING",
        entityId: existing.id,
        entityName: existing.title,
        metadata: {
            severity: existing.severity,
            confidence: existing.confidence,
            status: existing.status,
        },
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        });

    return res.json({
      message: "Finding deleted",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to delete finding",
    });
  }
}