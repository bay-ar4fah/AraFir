import { Router } from "express";

import {
  createCaseEvidenceMatrixItem,
  createCaseHypothesis,
  getCaseAttributionWorkspace,
  updateCaseAttributionAssessment,
  updateCaseHypothesis,
} from "../controllers/attributionController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  requirePermission,
} from "../middleware/rbacMiddleware";

const router = Router();

router.get(
  "/cases/:caseId/attribution",
  requireAuth,
  requirePermission("attribution:read"),
  getCaseAttributionWorkspace
);

router.patch(
  "/cases/:caseId/attribution",
  requireAuth,
  requirePermission("attribution:update"),
  updateCaseAttributionAssessment
);

router.post(
  "/cases/:caseId/attribution/hypotheses",
  requireAuth,
  requirePermission("attribution:update"),
  createCaseHypothesis
);

router.patch(
  "/attribution/hypotheses/:hypothesisId",
  requireAuth,
  requirePermission("attribution:update"),
  updateCaseHypothesis
);

router.post(
  "/cases/:caseId/attribution/evidence-matrix",
  requireAuth,
  requirePermission("attribution:update"),
  createCaseEvidenceMatrixItem
);

export default router;