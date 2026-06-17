import { Router } from "express";

import {
  uploadArtifact,
} from "../controllers/artifactController";

import {
  uploadEvidenceFile,
} from "../middleware/uploadMiddleware";
import { requireAuth } from "../middleware/authMiddleware";
import { requirePermission } from "../middleware/rbacMiddleware";

const router = Router();

router.post(
  "/cases/:caseId/artifacts",
  uploadEvidenceFile.single("file"),
  uploadArtifact,
  requireAuth,
  requirePermission("evidence:create")
);

router.get(
  "/cases/:caseId/artifacts/test",
  (_req, res) => {
    res.json({
      message: "Artifact route OK",
    });
  }
);

export default router;