"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const init_1 = require("./database/init");
const evidenceRoutes_1 = __importDefault(require("./routes/evidenceRoutes"));
const db_1 = require("./database/db");
const caseRoutes_1 = __importDefault(require("./routes/caseRoutes"));
const statusRoutes_1 = __importDefault(require("./routes/statusRoutes"));
const artifactRoutes_1 = __importDefault(require("./routes/artifactRoutes"));
const timelineRoutes_1 = __importDefault(require("./routes/timelineRoutes"));
const mitreFindingRoutes_1 = __importDefault(require("./routes/mitreFindingRoutes"));
const attackStoryRoutes_1 = __importDefault(require("./routes/attackStoryRoutes"));
const custodyRoutes_1 = __importDefault(require("./routes/custodyRoutes"));
const userSeeder_1 = require("./seeders/userSeeder");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
(0, init_1.initDatabase)();
setTimeout(() => {
    (0, userSeeder_1.seedDefaultAdmin)();
}, 300);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.get("/api/debug/evidence-schema", (_req, res) => {
    db_1.db.all("PRAGMA table_info(evidence)", [], (_err, rows) => {
        res.json(rows);
    });
});
app.get("/api/debug/tables", (_req, res) => {
    db_1.db.all(`
      SELECT name
      FROM sqlite_master
      WHERE type='table'
      `, [], (_err, rows) => {
        res.json(rows);
    });
});
app.get("/", (_req, res) => {
    res.send("AraFir API Running");
});
app.use("/api/evidence", evidenceRoutes_1.default);
app.use("/api/cases", caseRoutes_1.default);
app.use("/api/status", statusRoutes_1.default);
app.use("/api", artifactRoutes_1.default);
app.use("/api", timelineRoutes_1.default);
app.use("/api", mitreFindingRoutes_1.default);
app.use("/api", attackStoryRoutes_1.default);
app.use("/api", custodyRoutes_1.default);
app.listen(3001, () => {
    console.log("AraFir API Running on port 3001");
});
