"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvidence = listEvidence;
exports.addEvidence = addEvidence;
exports.listEvidenceByCase = listEvidenceByCase;
const evidenceService_1 = require("../services/evidenceService");
async function listEvidence(_req, res) {
    try {
        const data = await (0, evidenceService_1.getEvidence)();
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to load evidence",
        });
    }
}
async function addEvidence(req, res) {
    try {
        await (0, evidenceService_1.createEvidence)(req.body);
        return res.status(201).json({
            success: true,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to save evidence",
        });
    }
}
async function listEvidenceByCase(req, res) {
    try {
        const caseId = req.params.caseId;
        if (!caseId || Array.isArray(caseId)) {
            return res.status(400).json({
                error: "Invalid case id",
            });
        }
        const data = await (0, evidenceService_1.getEvidenceByCaseId)(caseId);
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to load case evidence",
        });
    }
}
