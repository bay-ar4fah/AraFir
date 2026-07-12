import { Request, Response } from "express";

import {
  createEvidenceImage,
  listEvidenceImagesByCase,
  updateEvidenceImageStatus,
} from "../services/evidenceImagingService";

import {
  CreateEvidenceImagePayload,
  EvidenceImagingStatus,
} from "../types/evidenceImaging";

const validStatuses: EvidenceImagingStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "VERIFIED",
  "FAILED",
];

function getRouteParam(
  req: Request,
  key: string
): string | null {
  const value = req.params[key] as
    | string
    | string[]
    | undefined;

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function getAuthenticatedActor(req: Request): string {
  return (
    (req as any).user?.email ||
    (req as any).user?.name ||
    "system"
  );
}

export const listEvidenceImagesController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = getRouteParam(req, "caseId");

    if (!caseId) {
      return res.status(400).json({
        message: "caseId is required",
      });
    }

    const images = await listEvidenceImagesByCase(
      caseId
    );

    return res.json(images);
  } catch (error) {
    console.error(
      "Failed to load evidence imaging records:",
      error
    );

    return res.status(500).json({
      message: "Failed to load evidence imaging records",
    });
  }
};

export const createEvidenceImageController = async (
  req: Request,
  res: Response
) => {
  try {
    const caseId = getRouteParam(req, "caseId");
    const payload =
      req.body as CreateEvidenceImagePayload;

    if (!caseId) {
      return res.status(400).json({
        message: "caseId is required",
      });
    }

    if (
      !payload.sourceDevice ||
      !payload.sourceType ||
      !payload.imageFormat
    ) {
      return res.status(400).json({
        message:
          "sourceDevice, sourceType, and imageFormat are required",
      });
    }

    const acquiredBy = getAuthenticatedActor(req);

    const record = await createEvidenceImage(
      caseId,
      payload,
      acquiredBy
    );

    return res.status(201).json(record);
  } catch (error) {
    console.error(
      "Failed to create evidence imaging record:",
      error
    );

    return res.status(500).json({
      message: "Failed to create evidence imaging record",
    });
  }
};

export const updateEvidenceImageStatusController =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const caseId = getRouteParam(req, "caseId");
      const imageIdParam = getRouteParam(
        req,
        "imageId"
      );

      const { status } = req.body as {
        status?: EvidenceImagingStatus;
      };

      if (!caseId) {
        return res.status(400).json({
          message: "caseId is required",
        });
      }

      if (!imageIdParam) {
        return res.status(400).json({
          message: "imageId is required",
        });
      }

      const imageId = Number(imageIdParam);

      if (
        !Number.isInteger(imageId) ||
        imageId <= 0
      ) {
        return res.status(400).json({
          message: "Invalid imageId",
        });
      }

      if (
        !status ||
        !validStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "Valid status is required",
        });
      }

      const record =
        await updateEvidenceImageStatus(
          caseId,
          imageId,
          status
        );

      if (!record) {
        return res.status(404).json({
          message:
            "Evidence image record not found",
        });
      }

      return res.json(record);
    } catch (error) {
      console.error(
        "Failed to update evidence imaging status:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update evidence imaging status",
      });
    }
  };