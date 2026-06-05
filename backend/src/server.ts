import express from "express";
import cors from "cors";

import {
  initDatabase
}
from "./database/init";

initDatabase();

const app =
  express();

app.use(cors());

app.use(express.json());

app.get(
  "/",
  (_req, res) => {

    res.send(
      "AraFir API Running"
    );

  }
);

app.listen(
  3001,
  () => {

    console.log(
      "AraFir API Running on port 3001"
    );

  }
);