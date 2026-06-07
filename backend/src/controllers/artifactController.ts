import { Request, Response } from "express";
import crypto from "crypto";
import fs from "fs";

import { createEvidence } from "../services/evidenceService";
import { createTimelineEvent } from "../services/timelineService";
import { parseArtifact } from "../parsers/parserRegistry";
import type { Evidence } from "../types/evidence";
import {
  generateMitreFindingsFromEvent,
} from "../services/mitreFindingService";

function sha256File(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => {
      hash.update(chunk);
    });

    stream.on("end", () => {
      resolve(hash.digest("hex"));
    });

    stream.on("error", reject);
  });
}

export async function uploadArtifact(
  req: Request,
  res: Response
) {
  try {
    const caseId = req.params.caseId;

    if (!caseId || Array.isArray(caseId)) {
      return res.status(400).json({
        error: "Invalid case id",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const evidenceId = crypto.randomUUID();
    const sha256 = await sha256File(req.file.path);

    const evidence: Evidence = {
      id: evidenceId,
      caseId,
      filename: req.file.originalname,
      fileType:
        req.file.originalname
          .split(".")
          .pop()
          ?.toUpperCase() || "UNKNOWN",
      size: req.file.size,
      sha256,
      importedAt: new Date().toISOString(),
      importedBy: "Investigator",
    };

    await createEvidence(evidence);

    const events = await parseArtifact({
      filePath: req.file.path,
      filename: req.file.originalname,
      caseId,
      evidenceId,
    });

    let mitreFindingsCount = 0;

    for (const event of events) {
      await createTimelineEvent(event);

      const findings =
        await generateMitreFindingsFromEvent(event);

      mitreFindingsCount += findings.length;
    }

    return res.status(201).json({
      success: true,
      evidence,
      timelineEvents: events.length,
      mitreFindings: mitreFindingsCount,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to upload artifact",
    });
  }
}