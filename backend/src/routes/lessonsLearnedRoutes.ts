import { Router } from "express";

import {
  createCaseCapaAction,
  getCaseLessonsWorkspace,
  updateCaseCapaAction,
  updateCaseLessons,
} from "../controllers/lessonsLearnedController";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  requirePermission,
} from "../middleware/rbacMiddleware";

const router = Router();

router.get(
  "/cases/:caseId/lessons",
  requireAuth,
  requirePermission("lessons:read"),
  getCaseLessonsWorkspace
);

router.patch(
  "/cases/:caseId/lessons",
  requireAuth,
  requirePermission("lessons:update"),
  updateCaseLessons
);

router.post(
  "/cases/:caseId/lessons/capa",
  requireAuth,
  requirePermission("lessons:update"),
  createCaseCapaAction
);

router.patch(
  "/lessons/capa/:capaId",
  requireAuth,
  requirePermission("lessons:update"),
  updateCaseCapaAction
);

export default router;