import { Router } from "express";

import {
  listCases,
  addCase,
  detailCase,
} from "../controllers/caseController";

import {
  listEvidenceByCase,
} from "../controllers/evidenceController";

const router = Router();

router.get("/", listCases);
router.post("/", addCase);
router.get("/:caseId/evidence", listEvidenceByCase);
router.get("/:id", detailCase);

export default router;