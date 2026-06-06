"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvidence = listEvidence;
exports.addEvidence = addEvidence;
const evidenceService_1 = require("../services/evidenceService");
async function listEvidence(_req, res) {
    try {
        const data = await (0, evidenceService_1.getEvidence)();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: error instanceof Error
                ? error.message
                : "Unknown error"
        });
    }
}
async function addEvidence(req, res) {
    try {
        await (0, evidenceService_1.createEvidence)(req.body);
        res.status(201).json({
            success: true
        });
    }
    catch {
        res
            .status(500)
            .json({
            error: "Failed to save evidence"
        });
    }
}
