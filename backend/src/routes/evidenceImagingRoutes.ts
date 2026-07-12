import { Router } from "express";

import {
  createEvidenceImageController,
  listEvidenceImagesController,
  updateEvidenceImageStatusController,
} from "../controllers/evidenceImagingController";

import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get(
  "/cases/:caseId/evidence-imaging",
  listEvidenceImagesController
);

router.post(
  "/cases/:caseId/evidence-imaging",
  createEvidenceImageController
);

router.patch(
  "/cases/:caseId/evidence-imaging/:imageId/status",
  updateEvidenceImageStatusController
);

export default router;