import { Router } from "express";

import {
  listCases,
  addCase,
  detailCase,
} from "../controllers/caseController";

import {
  listEvidenceByCase,
} from "../controllers/evidenceController";

import { requireAuth } from "../middleware/authMiddleware";
import { requirePermission } from "../middleware/rbacMiddleware";

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
  "/:id",
  requireAuth,
  requirePermission("case:read"),
  detailCase
);

export default router;