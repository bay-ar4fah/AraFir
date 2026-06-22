import { Router } from "express";

import {
  listCases,
  addCase,
  detailCase,
  deleteCase,
  reassignCaseById,
  listCaseAssignments,
} from "../controllers/caseController";

import {
  listEvidenceByCase,
} from "../controllers/evidenceController";

import { requireAuth } from "../middleware/authMiddleware";
import { requirePermission } from "../middleware/rbacMiddleware";

import {
  listCaseActivities,
} from "../controllers/caseActivityController";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission("case:read"),
  listCases
);

router.post(
  "/",
  requireAuth,
  requirePermission("case:create"),
  addCase
);

router.get(
  "/:caseId/evidence",
  requireAuth,
  requirePermission("evidence:read"),
  listEvidenceByCase
);

router.get(
  "/:caseId/activity",
  requireAuth,
  requirePermission("case:read"),
  listCaseActivities
);

router.get(
  "/:id/assignments",
  requireAuth,
  requirePermission("case:read"),
  listCaseAssignments
);

router.patch(
  "/:id/reassign",
  requireAuth,
  requirePermission("case:update"),
  reassignCaseById
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("case:read"),
  detailCase
);

router.delete(
  "/:id",
  requireAuth,
  requirePermission("case:delete"),
  deleteCase
);

export default router;