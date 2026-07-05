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

const VALID_INVESTIGATION_TYPES = [
  "WINDOWS_ENDPOINT",
  "LINUX_SERVER",
  "MEMORY_FORENSICS",
  "NETWORK_FORENSICS",
  "MOBILE_FORENSICS",
  "CLOUD_FORENSICS",
  "EMAIL_INVESTIGATION",
  "MALWARE_ANALYSIS",
  "RANSOMWARE",
  "INSIDER_THREAT",
  "MULTI_SOURCE",
];

const VALID_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const VALID_CLASSIFICATIONS = [
  "INTERNAL",
  "CONFIDENTIAL",
  "RESTRICTED",
  "LEGAL_HOLD",
];

function toJsonString(value: unknown) {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
}

function normalizeInvestigationType(value: unknown) {
  if (
    typeof value === "string" &&
    VALID_INVESTIGATION_TYPES.includes(value)
  ) {
    return value;
  }

  return "MULTI_SOURCE";
}

function normalizePriority(value: unknown) {
  if (
    typeof value === "string" &&
    VALID_PRIORITIES.includes(value)
  ) {
    return value;
  }

  return "MEDIUM";
}

function normalizeClassification(value: unknown) {
  if (
    typeof value === "string" &&
    VALID_CLASSIFICATIONS.includes(value)
  ) {
    return value;
  }

  return "INTERNAL";
}

export async function listCases(
  _req: Request,
  res: Response
) {
  try {
    const data = await getCases();
    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load cases",
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
      investigationType,
      priority,
      classification,
      expectedEvidence,
      caseTags,
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

    const normalizedInvestigationType =
      normalizeInvestigationType(investigationType);

    const normalizedPriority =
      normalizePriority(priority);

    const normalizedClassification =
      normalizeClassification(classification);

    const normalizedExpectedEvidence =
      toJsonString(expectedEvidence);

    const normalizedCaseTags =
      toJsonString(caseTags);

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
      investigationType: normalizedInvestigationType,
      priority: normalizedPriority,
      classification: normalizedClassification,
      expectedEvidence: normalizedExpectedEvidence,
      caseTags: normalizedCaseTags,
    });

    await createAuditLog({
      ...getAuditActor(req),
      action: "CASE_CREATED",
      entityType: "CASE",
      entityId: caseId,
      entityName: caseName,
      caseId,
      message: "Case created successfully",
      metadata: {
        investigatorId: assignedUser.id,
        investigatorName: assignedUser.name,
        investigationType: normalizedInvestigationType,
        priority: normalizedPriority,
        classification: normalizedClassification,
        expectedEvidence: normalizedExpectedEvidence,
        caseTags: normalizedCaseTags,
      },
    });

    await createAuditLog({
      ...getAuditActor(req),
      action: "CASE_REASSIGNED",
      entityType: "CASE",
      entityId: caseId,
      entityName: caseName,
      caseId,
      message: "Case assigned during creation",
      metadata: {
        assignedToUserId: assignedUser.id,
        assignedToName: assignedUser.name,
        assignedToRole: assignedUser.role,
      },
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
        error: "Invalid case id",
      });
    }

    const data = await getCaseById(id);

    if (!data) {
      return res.status(404).json({
        error: "Case not found",
      });
    }

    return res.json(data);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to load case",
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

    await createAuditLog({
      ...getAuditActor(req),
      action: "CASE_DELETED",
      entityType: "CASE",
      entityId: id,
      caseId: id,
      message: "Case deleted successfully",
    });

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

    await createAuditLog({
      ...getAuditActor(req),
      action: "CASE_REASSIGNED",
      entityType: "CASE",
      entityId: id,
      caseId: id,
      message: "Case reassigned successfully",
      metadata: {
        assignedToUserId: assignedUser.id,
        assignedToName: assignedUser.name,
        assignedToRole: assignedUser.role,
        reason: reason || "Case reassigned",
      },
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