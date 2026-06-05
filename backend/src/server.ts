import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("AraFir API Running");
});

app.listen(3001, () => {
  console.log(
    "AraFir API Running on port 3001"
  );
});