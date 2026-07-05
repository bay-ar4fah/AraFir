import { Router } from "express";
import {
  createMemoryArtifactController,
  falsePositiveMemoryArtifactController,
  getMemoryArtifactsController,
  getMemoryNetworkController,
  getMemoryProcessesController,
  getMemorySummaryController,
  reviewMemoryArtifactController,
} from "../controllers/memoryController";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/cases/:caseId/memory/summary", getMemorySummaryController);
router.get("/cases/:caseId/memory/artifacts", getMemoryArtifactsController);
router.get("/cases/:caseId/memory/processes", getMemoryProcessesController);
router.get("/cases/:caseId/memory/network", getMemoryNetworkController);

router.post("/cases/:caseId/memory/artifacts", createMemoryArtifactController);

router.patch(
  "/cases/:caseId/memory/artifacts/:artifactId/review",
  reviewMemoryArtifactController
);

router.patch(
  "/cases/:caseId/memory/artifacts/:artifactId/false-positive",
  falsePositiveMemoryArtifactController
);

export default router;