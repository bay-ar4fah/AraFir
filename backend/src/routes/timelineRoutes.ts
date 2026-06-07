import { Router } from "express";

import {
  listAllTimelineEvents,
  listTimelineByCase,
} from "../controllers/timelineController";

const router = Router();

router.get(
  "/timeline",
  listAllTimelineEvents
);

router.get(
  "/cases/:caseId/timeline",
  listTimelineByCase
);

export default router;