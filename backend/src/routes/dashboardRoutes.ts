import { Router } from "express";

import {
  getDashboard,
} from "../controllers/dashboardController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  requirePermission,
} from "../middleware/rbacMiddleware";

const router = Router();

router.get(
  "/investigation",
  requireAuth,
  requirePermission("case:read"),
  getDashboard
);

export default router;