import fs from "fs";
import path from "path";
import multer from "multer";
import type {
  Request,
  Response,
  NextFunction,
} from "express";

const uploadDir = path.join(
  process.cwd(),
  "uploads",
  "evidence"
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

const getMaxUploadSizeBytes = () => {
  const maxUploadSizeMb = Number(
    process.env.MAX_EVIDENCE_UPLOAD_SIZE_MB || 5120
  );

  if (
    Number.isNaN(maxUploadSizeMb) ||
    maxUploadSizeMb <= 0
  ) {
    return 5120 * 1024 * 1024;
  }

  return maxUploadSizeMb * 1024 * 1024;
};

const sanitizeFilename = (filename: string) => {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 180);
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },

  filename: (_req, file, callback) => {
    const timestamp = Date.now();
    const random = Math.round(
      Math.random() * 1e9
    );

    const safeOriginalName = sanitizeFilename(
      file.originalname
    );

    callback(
      null,
      `${timestamp}-${random}-${safeOriginalName}`
    );
  },
});

export const uploadEvidenceFile = multer({
  storage,
  limits: {
    fileSize: getMaxUploadSizeBytes(),
  },
});

export const handleEvidenceUploadError = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Evidence file is too large",
        error: `Maximum upload size is ${
          getMaxUploadSizeBytes() / 1024 / 1024
        } MB`,
      });
    }

    return res.status(400).json({
      message: "Evidence upload failed",
      error: error.message,
      code: error.code,
    });
  }

  return res.status(500).json({
    message: "Unexpected evidence upload error",
    error:
      error instanceof Error
        ? error.message
        : String(error),
  });
};