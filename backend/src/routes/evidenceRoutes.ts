import {
  Router
}
from "express";

import {
  listEvidence,
  addEvidence
}
from "../controllers/evidenceController";

const router =
  Router();

router.get(
  "/",
  listEvidence
);

router.post(
  "/",
  addEvidence
);

export default router;