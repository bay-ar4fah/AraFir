import { Router } from "express";

import {
  listTimelineByCase,
} from "../controllers/timelineController";

const router = Router();

router.get(
  "/cases/:caseId/timeline",
  listTimelineByCase
);

export default router;