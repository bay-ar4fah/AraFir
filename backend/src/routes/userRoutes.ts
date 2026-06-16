import { Router } from "express";

import {
  listUsers,
  addUser,
  changeUserRole,
  disableUser,
  enableUser,
  resetPassword,
  listCaseAssignableUsers,
} from "../controllers/userController";

import { requireAuth } from "../middleware/authMiddleware";
import { requirePermission } from "../middleware/rbacMiddleware";

const router = Router();

router.get(
  "/",
  requireAuth,
  requirePermission("user:manage"),
  listUsers
);

router.post(
  "/",
  requireAuth,
  requirePermission("user:manage"),
  addUser
);

router.patch(
  "/:id/role",
  requireAuth,
  requirePermission("user:manage"),
  changeUserRole
);

router.patch(
  "/:id/disable",
  requireAuth,
  requirePermission("user:manage"),
  disableUser
);

router.patch(
  "/:id/enable",
  requireAuth,
  requirePermission("user:manage"),
  enableUser
);

router.patch(
  "/:id/reset-password",
  requireAuth,
  requirePermission("user:manage"),
  resetPassword
);

router.get(
  "/case-assignable",
  requireAuth,
  requirePermission("case:create"),
  listCaseAssignableUsers
);

export default router;