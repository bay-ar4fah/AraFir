import { Router } from "express";

import {
  listCustodyByCase,
  listCustodyByEvidence,
} from "../controllers/custodyController";

const router = Router();

router.get(
  "/cases/:caseId/custody",
  listCustodyByCase
);

router.get(
  "/evidence/:evidenceId/custody",
  listCustodyByEvidence
);

export default router;