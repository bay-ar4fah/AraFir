import { Router } from "express";

import {
  listUsers,
  addUser,
  changeUserRole,
  disableUser,
  enableUser,
  resetPassword,
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

export default router;