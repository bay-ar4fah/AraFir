import multer from "multer";
import path from "path";
import fs from "fs";

const storageDir = path.join(
  process.cwd(),
  "storage",
  "evidence"
);

if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, storageDir);
  },

  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    cb(
      null,
      `${Date.now()}-${crypto.randomUUID()}-${safeName}`
    );
  },
});

export const uploadEvidenceFile = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 200,
  },
});