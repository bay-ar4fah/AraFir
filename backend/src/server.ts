import express from "express";
import cors from "cors";

import {
  initDatabase
}
from "./database/init";

import evidenceRoutes
from "./routes/evidenceRoutes";

import { db }
from "./database/db";

import caseRoutes from "./routes/caseRoutes";

import statusRoutes from "./routes/statusRoutes";

import artifactRoutes from "./routes/artifactRoutes";

import timelineRoutes from "./routes/timelineRoutes";

import mitreFindingRoutes
from "./routes/mitreFindingRoutes";

import attackStoryRoutes
from "./routes/attackStoryRoutes";

import custodyRoutes
from "./routes/custodyRoutes";

import { seedDefaultAdmin } from "./seeders/userSeeder";

import authRoutes from "./routes/authRoutes";

import userRoutes from "./routes/userRoutes";

import passwordRoutes from "./routes/passwordRoutes";

import auditRoutes from "./routes/auditRoutes";

import dashboardRoutes from "./routes/dashboardRoutes";

import findingRoutes from "./routes/findingRoutes";

import attributionRoutes from "./routes/attributionRoutes";

import lessonsLearnedRoutes from "./routes/lessonsLearnedRoutes";

import memoryRoutes from "./routes/memoryRoutes";

import evidenceImagingRoutes from "./routes/evidenceImagingRoutes";

initDatabase();

setTimeout(() => {
  seedDefaultAdmin();
}, 300);

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", passwordRoutes);

app.use("/api/users", userRoutes);

app.use("/api/audit-logs", auditRoutes);

app.get(
  "/api/debug/evidence-schema",
  (_req, res) => {

    db.all(
      "PRAGMA table_info(evidence)",
      [],
      (_err, rows) => {

        res.json(rows);

      }
    );

  }
);

app.get(
  "/api/debug/tables",
  (_req, res) => {

    db.all(
      `
      SELECT name
      FROM sqlite_master
      WHERE type='table'
      `,
      [],
      (_err, rows) => {

        res.json(rows);

      }
    );

  }
);

app.get(
  "/",
  (_req, res) => {

    res.send(
      "AraFir API Running"
    );

  }
);

app.use(
  "/api/evidence",
  evidenceRoutes
);

app.use(
  "/api/cases",
  caseRoutes
);

app.use(
  "/api/status",
  statusRoutes
);

app.use(
  "/api",
  artifactRoutes
);

app.use(
  "/api",
  timelineRoutes
);

app.use(
  "/api",
  mitreFindingRoutes
);

app.use(
  "/api",
  attackStoryRoutes
);

app.use(
  "/api", 
  findingRoutes
);

app.use("/api", memoryRoutes);

app.use("/api", evidenceImagingRoutes);

app.use(
  "/api", 
  attributionRoutes
);

app.use(
  "/api",
  custodyRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api", 
  lessonsLearnedRoutes
);

app.listen(
  3001,
  () => {

    console.log(
      "AraFir API Running on port 3001"
    );

  }
);