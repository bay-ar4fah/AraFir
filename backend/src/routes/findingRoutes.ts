import { Router } from "express";

import {
  createCaseFinding,
  deleteCaseFinding,
  listCaseFindings,
  updateCaseFinding,
} from "../controllers/findingController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  requirePermission,
} from "../middleware/rbacMiddleware";

const router = Router();

router.get(
  "/cases/:caseId/findings",
  requireAuth,
  requirePermission("finding:read"),
  listCaseFindings
);

router.post(
  "/cases/:caseId/findings",
  requireAuth,
  requirePermission("finding:create"),
  createCaseFinding
);

router.patch(
  "/findings/:findingId",
  requireAuth,
  requirePermission("finding:update"),
  updateCaseFinding
);

router.delete(
  "/findings/:findingId",
  requireAuth,
  requirePermission("finding:delete"),
  deleteCaseFinding
);

export default router;