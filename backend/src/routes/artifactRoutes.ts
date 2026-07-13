import { Router } from "express";

import {
  uploadArtifact,
} from "../controllers/artifactController";

import {
  uploadEvidenceFile,
  handleEvidenceUploadError,
} from "../middleware/uploadMiddleware";

import {
  requireAuth,
} from "../middleware/authMiddleware";

import {
  requirePermission,
} from "../middleware/rbacMiddleware";

const router = Router();

router.post(
  "/cases/:caseId/artifacts",
  requireAuth,
  requirePermission("evidence:create"),
  uploadEvidenceFile.single("file"),
  handleEvidenceUploadError,
  uploadArtifact
);

router.get(
  "/cases/:caseId/artifacts/test",
  requireAuth,
  (_req, res) => {
    res.json({
      message: "Artifact route OK",
    });
  }
);

export default router;