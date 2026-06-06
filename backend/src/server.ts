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

initDatabase();

const app = express();

app.use(cors());

app.use(express.json());

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

app.listen(
  3001,
  () => {

    console.log(
      "AraFir API Running on port 3001"
    );

  }
);