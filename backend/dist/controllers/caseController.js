"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCases = listCases;
exports.addCase = addCase;
const caseService_1 = require("../services/caseService");
async function listCases(_req, res) {
    try {
        const data = await (0, caseService_1.getCases)();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({
            error: "Failed to load cases"
        });
    }
}
async function addCase(req, res) {
    try {
        await (0, caseService_1.createCase)(req.body);
        res.status(201).json({
            success: true
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to create case"
        });
    }
}
