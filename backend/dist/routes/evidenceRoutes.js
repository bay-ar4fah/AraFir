"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const evidenceController_1 = require("../controllers/evidenceController");
const router = (0, express_1.Router)();
router.get("/", evidenceController_1.listEvidence);
router.post("/", evidenceController_1.addEvidence);
exports.default = router;
