import { Router } from "express";

import {
  listCases,
  addCase
} from "../controllers/caseController";

const router = Router();

router.get("/", listCases);
router.post("/", addCase);

export default router;