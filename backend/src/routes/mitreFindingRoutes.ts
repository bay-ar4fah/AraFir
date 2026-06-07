import { Router } from "express";

import {
  listMitreFindingsByCase,
} from "../controllers/mitreFindingController";

const router = Router();

router.get(
  "/cases/:caseId/mitre",
  listMitreFindingsByCase
);

export default router;