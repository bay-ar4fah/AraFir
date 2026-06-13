import { Router } from "express";

import {
  listCases,
  addCase,
  detailCase,
  deleteCase
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

router.delete(
  "/:id",
  requireAuth,
  requirePermission("case:delete"),
  deleteCase
);

export default router;