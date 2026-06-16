import { Request, Response } from "express";
import { randomUUID } from "crypto";

import {
  getCases,
  createCase,
  deleteCaseCascade,
  getCaseById,
  getAssignableUserById,
} from "../services/caseService";

import {
  createAuditLog,
} from "../services/auditService";

import {
  getAuditActor,
} from "../utils/auditUtils";

import {
  createCaseAssignmentLog,
  getCaseAssignmentLogs,
} from "../services/caseAssignmentService";

import {
  reassignCase,
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
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const {
      caseName,
      description,
      investigatorId,
    } = req.body;

    if (!caseName || !investigatorId) {
      return res.status(400).json({
        error: "caseName and investigatorId are required",
      });
    }

    const assignedUser =
      await getAssignableUserById(investigatorId);

    if (!assignedUser) {
      return res.status(400).json({
        error: "Selected investigator is invalid or inactive",
      });
    }

    const caseId = randomUUID();

    await createCase({
      id: caseId,
      caseName,
      description,
      investigatorId: assignedUser.id,
      investigatorName: assignedUser.name,
      assignedByUserId: req.user.id,
      assignedByName: req.user.name,
      status: "OPEN",
    });

    await createCaseAssignmentLog({
      caseId,
      assignedToUserId: assignedUser.id,
      assignedToName: assignedUser.name,
      assignedToRole: assignedUser.role,
      assignedByUserId: req.user.id,
      assignedByName: req.user.name,
      assignedByRole: req.user.role,
      action: "ASSIGNED",
      reason: "Initial case assignment",
    });

    return res.status(201).json({
      success: true,
      caseId,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to create case",
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
export async function deleteCase(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid case id",
      });
    }

    await deleteCaseCascade(id);

    return res.json({
      success: true,
      message: "Case deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to delete case",
    });
  }
}

export async function reassignCaseById(
  req: Request,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { id } = req.params;
    const {
      investigatorId,
      reason,
    } = req.body;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid case id",
      });
    }

    if (!investigatorId) {
      return res.status(400).json({
        error: "investigatorId is required",
      });
    }

    const assignedUser =
      await getAssignableUserById(investigatorId);

    if (!assignedUser) {
      return res.status(400).json({
        error: "Selected investigator is invalid or inactive",
      });
    }

    await reassignCase({
      caseId: id,
      investigatorId: assignedUser.id,
      investigatorName: assignedUser.name,
      assignedByUserId: req.user.id,
      assignedByName: req.user.name,
    });

    await createCaseAssignmentLog({
      caseId: id,
      assignedToUserId: assignedUser.id,
      assignedToName: assignedUser.name,
      assignedToRole: assignedUser.role,
      assignedByUserId: req.user.id,
      assignedByName: req.user.name,
      assignedByRole: req.user.role,
      action: "REASSIGNED",
      reason: reason || "Case reassigned",
    });

    return res.json({
      success: true,
      message: "Case reassigned successfully",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to reassign case",
    });
  }
  
}

export async function listCaseAssignments(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid case id",
      });
    }

    const logs =
      await getCaseAssignmentLogs(id);

    return res.json(logs);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load assignment history",
    });
  }
}