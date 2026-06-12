import { Router } from "express";

import {
  listAuditLogs,
  listAuditLogsByCase,
} from "../controllers/auditController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  requirePermission,
} from "../middleware/rbacMiddleware";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission("audit:read"),
  listAuditLogs
);

router.get(
  "/cases/:caseId",
  requireAuth,
  requirePermission("audit:read"),
  listAuditLogsByCase
);

export default router;