import { Router } from "express";

import {
  getAttackStoryByCase,
} from "../controllers/attackStoryController";

const router = Router();

router.get(
  "/cases/:caseId/attack-story",
  getAttackStoryByCase
);

export default router;