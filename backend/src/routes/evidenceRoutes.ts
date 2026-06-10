import {
  Router
}
from "express";

import {
  listEvidence,
  addEvidence,
  excludeEvidenceById,
  restoreEvidenceById,
} from "../controllers/evidenceController";

import { requireAuth } from "../middleware/authMiddleware";
import { requirePermission } from "../middleware/rbacMiddleware";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission("evidence:read"),
  listEvidence
);

router.post(
  "/",
  requireAuth,
  requirePermission("evidence:create"),
  addEvidence
);

router.patch(
  "/:evidenceId/exclude",
  requireAuth,
  requirePermission("evidence:exclude"),
  excludeEvidenceById
);

router.patch(
  "/:evidenceId/restore",
  requireAuth,
  requirePermission("evidence:restore"),
  restoreEvidenceById
);

export default router;