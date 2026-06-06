"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caseController_1 = require("../controllers/caseController");
const router = (0, express_1.Router)();
router.get("/", caseController_1.listCases);
router.post("/", caseController_1.addCase);
exports.default = router;
