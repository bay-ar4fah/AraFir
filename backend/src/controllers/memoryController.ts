import { Request, Response } from "express";

import {
  createMemoryArtifact,
  getMemoryArtifactsByCase,
  getMemoryNetworkByCase,
  getMemoryProcessesByCase,
  getMemorySummary,
  updateMemoryArtifactStatus,
} from "../services/memoryService";

import { CreateMemoryArtifactRequest } from "../types/memory";

const parseCaseId = (req: Request): number => {
  return Number(req.params.caseId);
};

const isInvalidId = (id: number): boolean => {
  return !Number.isInteger(id) || id <= 0;
};

export const getMemorySummaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = parseCaseId(req);

    if (isInvalidId(caseId)) {
      return res.status(400).json({
        message: "Invalid caseId",
      });
    }

    const summary = await getMemorySummary(caseId);

    return res.json(summary);
  } catch {
    return res.status(500).json({
      message: "Failed to load memory summary",
    });
  }
};

export const getMemoryArtifactsController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = parseCaseId(req);

    if (isInvalidId(caseId)) {
      return res.status(400).json({
        message: "Invalid caseId",
      });
    }

    const artifacts = await getMemoryArtifactsByCase(caseId);

    return res.json(artifacts);
  } catch {
    return res.status(500).json({
      message: "Failed to load memory artifacts",
    });
  }
};

export const getMemoryProcessesController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = parseCaseId(req);

    if (isInvalidId(caseId)) {
      return res.status(400).json({
        message: "Invalid caseId",
      });
    }

    const processes = await getMemoryProcessesByCase(caseId);

    return res.json(processes);
  } catch {
    return res.status(500).json({
      message: "Failed to load memory processes",
    });
  }
};

export const getMemoryNetworkController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = parseCaseId(req);

    if (isInvalidId(caseId)) {
      return res.status(400).json({
        message: "Invalid caseId",
      });
    }

    const network = await getMemoryNetworkByCase(caseId);

    return res.json(network);
  } catch {
    return res.status(500).json({
      message: "Failed to load memory network artifacts",
    });
  }
};

export const createMemoryArtifactController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = parseCaseId(req);
    const payload = req.body as CreateMemoryArtifactRequest;

    if (isInvalidId(caseId)) {
      return res.status(400).json({
        message: "Invalid caseId",
      });
    }

    if (!payload.artifactType || !payload.name) {
      return res.status(400).json({
        message: "artifactType and name are required",
      });
    }

    const createdBy =
      (req as any).user?.email ||
      (req as any).user?.name ||
      "system";

    const artifact = await createMemoryArtifact(
      caseId,
      payload,
      createdBy
    );

    return res.status(201).json(artifact);
  } catch {
    return res.status(500).json({
      message: "Failed to create memory artifact",
    });
  }
};

export const reviewMemoryArtifactController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = parseCaseId(req);
    const artifactId = Number(req.params.artifactId);

    if (isInvalidId(caseId) || isInvalidId(artifactId)) {
      return res.status(400).json({
        message: "Invalid caseId or artifactId",
      });
    }

    const artifact = await updateMemoryArtifactStatus(
      caseId,
      artifactId,
      "REVIEWED"
    );

    if (!artifact) {
      return res.status(404).json({
        message: "Memory artifact not found",
      });
    }

    return res.json(artifact);
  } catch {
    return res.status(500).json({
      message: "Failed to review memory artifact",
    });
  }
};

export const falsePositiveMemoryArtifactController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = parseCaseId(req);
    const artifactId = Number(req.params.artifactId);

    if (isInvalidId(caseId) || isInvalidId(artifactId)) {
      return res.status(400).json({
        message: "Invalid caseId or artifactId",
      });
    }

    const artifact = await updateMemoryArtifactStatus(
      caseId,
      artifactId,
      "FALSE_POSITIVE"
    );

    if (!artifact) {
      return res.status(404).json({
        message: "Memory artifact not found",
      });
    }

    return res.json(artifact);
  } catch {
    return res.status(500).json({
      message: "Failed to mark memory artifact as false positive",
    });
  }
};