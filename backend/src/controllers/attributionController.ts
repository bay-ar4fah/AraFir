import { Request, Response } from "express";

import {
  createEvidenceMatrixItem,
  createHypothesis,
  getAttributionWorkspace,
  isAttributionConfidence,
  isAttributionStatus,
  isEvidenceRating,
  isHypothesisStatus,
  updateHypothesis,
  upsertAssessment,
} from "../services/attributionService";

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

export async function getCaseAttributionWorkspace(
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

    const workspace =
      await getAttributionWorkspace(
        caseId,
        req.user!.id,
        req.user!.name
      );

    return res.json(workspace);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to load attribution workspace",
    });
  }
}

export async function updateCaseAttributionAssessment(
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
      confidence,
      attributionStatus,
    } = req.body;

    if (
      confidence &&
      !isAttributionConfidence(confidence)
    ) {
      return res.status(400).json({
        message: "Invalid attribution confidence",
      });
    }

    if (
      attributionStatus &&
      !isAttributionStatus(attributionStatus)
    ) {
      return res.status(400).json({
        message: "Invalid attribution status",
      });
    }

    const assessment =
      await upsertAssessment({
        caseId,
        ...req.body,
        actorUserId: req.user!.id,
        actorName: req.user!.name,
      });

    await createAuditLog({
      action: "ATTRIBUTION_UPDATED",
      status: "SUCCESS",
      message: "Attribution assessment updated",
      actorUserId: req.user!.id,
      actorName: req.user!.name,
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      caseId,
      entityType: "ATTRIBUTION_ASSESSMENT",
      entityId: assessment.id,
      entityName:
        assessment.threatActor ||
        assessment.campaignName ||
        "Attribution Assessment",
      metadata: {
        confidence: assessment.confidence,
        attributionStatus:
          assessment.attributionStatus,
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.json(assessment);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to update attribution assessment",
    });
  }
}

export async function createCaseHypothesis(
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
      assessmentId,
      title,
      description,
      confidence,
    } = req.body;

    if (!assessmentId || !title || !confidence) {
      return res.status(400).json({
        message:
          "assessmentId, title, and confidence are required",
      });
    }

    if (!isAttributionConfidence(confidence)) {
      return res.status(400).json({
        message: "Invalid confidence",
      });
    }

    const hypothesis =
      await createHypothesis({
        caseId,
        assessmentId,
        title,
        description,
        confidence,
        createdBy: req.user!.id,
        createdByName: req.user!.name,
      });

    await createAuditLog({
      action: "ATTRIBUTION_HYPOTHESIS_CREATED",
      status: "SUCCESS",
      message: "Attribution hypothesis created",
      actorUserId: req.user!.id,
      actorName: req.user!.name,
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      caseId,
      entityType: "ATTRIBUTION_HYPOTHESIS",
      entityId: hypothesis.id,
      entityName: hypothesis.title,
      metadata: {
        confidence: hypothesis.confidence,
        status: hypothesis.status,
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(201).json(hypothesis);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to create hypothesis",
    });
  }
}

export async function updateCaseHypothesis(
  req: Request,
  res: Response
) {
  try {
    const hypothesisId =
      getSingleParam(req.params.hypothesisId);

    if (!hypothesisId) {
      return res.status(400).json({
        message: "Invalid hypothesis id",
      });
    }

    const {
      status,
      confidence,
    } = req.body;

    if (status && !isHypothesisStatus(status)) {
      return res.status(400).json({
        message: "Invalid hypothesis status",
      });
    }

    if (
      confidence &&
      !isAttributionConfidence(confidence)
    ) {
      return res.status(400).json({
        message: "Invalid confidence",
      });
    }

    await updateHypothesis({
      id: hypothesisId,
      ...req.body,
    });

    await createAuditLog({
      action: "ATTRIBUTION_HYPOTHESIS_UPDATED",
      status: "SUCCESS",
      message: "Attribution hypothesis updated",
      actorUserId: req.user!.id,
      actorName: req.user!.name,
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      entityType: "ATTRIBUTION_HYPOTHESIS",
      entityId: hypothesisId,
      entityName: req.body.title ?? "Hypothesis",
      metadata: {
        status,
        confidence,
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.json({
      message: "Hypothesis updated",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to update hypothesis",
    });
  }
}

export async function createCaseEvidenceMatrixItem(
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
      assessmentId,
      evidenceId,
      findingId,
      reliability,
      relevance,
      weight,
      notes,
    } = req.body;

    if (
      !assessmentId ||
      !reliability ||
      !relevance ||
      weight === undefined
    ) {
      return res.status(400).json({
        message:
          "assessmentId, reliability, relevance, and weight are required",
      });
    }

    if (!isEvidenceRating(reliability)) {
      return res.status(400).json({
        message: "Invalid reliability rating",
      });
    }

    if (!isEvidenceRating(relevance)) {
      return res.status(400).json({
        message: "Invalid relevance rating",
      });
    }

    const normalizedWeight = Number(weight);

    if (
      Number.isNaN(normalizedWeight) ||
      normalizedWeight < 1 ||
      normalizedWeight > 5
    ) {
      return res.status(400).json({
        message: "Weight must be between 1 and 5",
      });
    }

    await createEvidenceMatrixItem({
      caseId,
      assessmentId,
      evidenceId,
      findingId,
      reliability,
      relevance,
      weight: normalizedWeight,
      notes,
      createdBy: req.user!.id,
      createdByName: req.user!.name,
    });

    await createAuditLog({
      action: "ATTRIBUTION_EVIDENCE_MATRIX_CREATED",
      status: "SUCCESS",
      message:
        "Attribution evidence matrix item created",
      actorUserId: req.user!.id,
      actorName: req.user!.name,
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      caseId,
      entityType: "ATTRIBUTION_EVIDENCE_MATRIX",
      entityId: evidenceId || findingId || null,
      entityName: "Evidence Confidence Matrix",
      metadata: {
        evidenceId,
        findingId,
        reliability,
        relevance,
        weight: normalizedWeight,
      },
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(201).json({
      message: "Evidence matrix item created",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to create evidence matrix item",
    });
  }
}