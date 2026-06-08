import {
  Router
}
from "express";

import {
  listEvidence,
  addEvidence,
  excludeEvidenceById,
  restoreEvidenceById,
} from "../controllers/evidenceController";

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

router.patch(
  "/:evidenceId/exclude",
  excludeEvidenceById
);

router.patch(
  "/:evidenceId/restore",
  restoreEvidenceById
);

export default router;