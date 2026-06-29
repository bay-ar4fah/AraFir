import { Request, Response } from "express";

import {
  createCapaAction,
  getLessonsWorkspace,
  isCapaActionType,
  isCapaPriority,
  isCapaStatus,
  isLessonsStatus,
  isRootCauseCategory,
  updateCapaAction,
  upsertLessons,
} from "../services/lessonsLearnedService";

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

export async function getCaseLessonsWorkspace(
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
      await getLessonsWorkspace(
        caseId,
        req.user!.id,
        req.user!.name
      );

    return res.json(workspace);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to load lessons learned workspace",
    });
  }
}

export async function updateCaseLessons(
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
      rootCauseCategory,
      overallStatus,
    } = req.body;

    if (
      rootCauseCategory &&
      !isRootCauseCategory(rootCauseCategory)
    ) {
      return res.status(400).json({
        message: "Invalid root cause category",
      });
    }

    if (
      overallStatus &&
      !isLessonsStatus(overallStatus)
    ) {
      return res.status(400).json({
        message: "Invalid lessons status",
      });
    }

    const lessons =
      await upsertLessons({
        caseId,
        ...req.body,
        actorUserId: req.user!.id,
        actorName: req.user!.name,
      });

    await createAuditLog({
      action: "LESSONS_UPDATED",
      status: "SUCCESS",
      message:
        "Lessons learned updated",
      actorUserId: req.user!.id,
      actorName: req.user!.name,
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      caseId,
      entityType: "LESSONS_LEARNED",
      entityId: lessons.id,
      entityName: "Lessons Learned",
      metadata: {
        rootCauseCategory:
          lessons.rootCauseCategory,
        overallStatus:
          lessons.overallStatus,
      },
      ipAddress: req.ip,
      userAgent:
        req.headers["user-agent"],
    });

    return res.json(lessons);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to update lessons learned",
    });
  }
}

export async function createCaseCapaAction(
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
      lessonsLearnedId,
      actionType,
      title,
      description,
      priority,
      ownerTeam,
      ownerName,
      dueDate,
      linkedFindingId,
      linkedEvidenceId,
    } = req.body;

    if (
      !lessonsLearnedId ||
      !actionType ||
      !title ||
      !priority
    ) {
      return res.status(400).json({
        message:
          "lessonsLearnedId, actionType, title, and priority are required",
      });
    }

    if (!isCapaActionType(actionType)) {
      return res.status(400).json({
        message: "Invalid CAPA action type",
      });
    }

    if (!isCapaPriority(priority)) {
      return res.status(400).json({
        message: "Invalid CAPA priority",
      });
    }

    const capa =
      await createCapaAction({
        caseId,
        lessonsLearnedId,
        actionType,
        title,
        description,
        priority,
        ownerTeam,
        ownerName,
        dueDate,
        linkedFindingId,
        linkedEvidenceId,
        createdBy: req.user!.id,
        createdByName: req.user!.name,
      });

    await createAuditLog({
      action: "CAPA_CREATED",
      status: "SUCCESS",
      message: "CAPA action created",
      actorUserId: req.user!.id,
      actorName: req.user!.name,
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      caseId,
      entityType: "CAPA_ACTION",
      entityId: capa.id,
      entityName: capa.title,
      metadata: {
        actionType: capa.actionType,
        priority: capa.priority,
        status: capa.status,
      },
      ipAddress: req.ip,
      userAgent:
        req.headers["user-agent"],
    });

    return res.status(201).json(capa);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to create CAPA action",
    });
  }
}

export async function updateCaseCapaAction(
  req: Request,
  res: Response
) {
  try {
    const capaId =
      getSingleParam(req.params.capaId);

    if (!capaId) {
      return res.status(400).json({
        message: "Invalid CAPA id",
      });
    }

    const {
      priority,
      status,
    } = req.body;

    if (
      priority &&
      !isCapaPriority(priority)
    ) {
      return res.status(400).json({
        message: "Invalid CAPA priority",
      });
    }

    if (
      status &&
      !isCapaStatus(status)
    ) {
      return res.status(400).json({
        message: "Invalid CAPA status",
      });
    }

    await updateCapaAction({
      id: capaId,
      ...req.body,
      updatedBy: req.user!.id,
      updatedByName: req.user!.name,
      verifiedBy:
        status === "VERIFIED"
          ? req.user!.id
          : undefined,
      verifiedByName:
        status === "VERIFIED"
          ? req.user!.name
          : undefined,
    });

    await createAuditLog({
      action: "CAPA_UPDATED",
      status: "SUCCESS",
      message: "CAPA action updated",
      actorUserId: req.user!.id,
      actorName: req.user!.name,
      actorEmail: req.user!.email,
      actorRole: req.user!.role,
      entityType: "CAPA_ACTION",
      entityId: capaId,
      entityName:
        req.body.title ?? "CAPA Action",
      metadata: {
        status,
        priority,
      },
      ipAddress: req.ip,
      userAgent:
        req.headers["user-agent"],
    });

    return res.json({
      message: "CAPA action updated",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message:
        "Failed to update CAPA action",
    });
  }
}