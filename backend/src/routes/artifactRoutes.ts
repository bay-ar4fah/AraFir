import { Router } from "express";

import {
  uploadArtifact,
} from "../controllers/artifactController";

import {
  uploadEvidenceFile,
} from "../middleware/uploadMiddleware";

const router = Router();

router.post(
  "/cases/:caseId/artifacts",
  uploadEvidenceFile.single("file"),
  uploadArtifact
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