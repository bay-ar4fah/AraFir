"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caseController_1 = require("../controllers/caseController");
const evidenceController_1 = require("../controllers/evidenceController");
const router = (0, express_1.Router)();
console.log("CASE ROUTES DEBUG:", {
    listCases: caseController_1.listCases,
    addCase: caseController_1.addCase,
    detailCase: caseController_1.detailCase,
    listEvidenceByCase: evidenceController_1.listEvidenceByCase,
});
router.get("/", caseController_1.listCases);
router.post("/", caseController_1.addCase);
router.get("/:caseId/evidence", evidenceController_1.listEvidenceByCase);
router.get("/:id", caseController_1.detailCase);
exports.default = router;
