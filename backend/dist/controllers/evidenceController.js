"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvidence = listEvidence;
exports.addEvidence = addEvidence;
exports.listEvidenceByCase = listEvidenceByCase;
exports.excludeEvidenceById = excludeEvidenceById;
exports.restoreEvidenceById = restoreEvidenceById;
const evidenceService_1 = require("../services/evidenceService");
const evidenceService_2 = require("../services/evidenceService");
const custodyService_1 = require("../services/custodyService");
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
async function excludeEvidenceById(req, res) {
    try {
        const evidenceId = req.params.evidenceId;
        const { caseId, reason, user, } = req.body;
        if (!evidenceId || Array.isArray(evidenceId)) {
            return res.status(400).json({
                error: "Invalid evidence id",
            });
        }
        if (!caseId || !reason) {
            return res.status(400).json({
                error: "caseId and reason are required",
            });
        }
        await (0, evidenceService_2.excludeEvidence)({
            evidenceId,
            excludedBy: user || "Investigator",
            reason,
        });
        await (0, custodyService_1.createCustodyLog)({
            caseId,
            evidenceId,
            action: "EXCLUDE",
            user: user || "Investigator",
            reason,
        });
        return res.json({
            success: true,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to exclude evidence",
        });
    }
}
async function restoreEvidenceById(req, res) {
    try {
        const evidenceId = req.params.evidenceId;
        const { caseId, user, reason, } = req.body;
        if (!evidenceId || Array.isArray(evidenceId)) {
            return res.status(400).json({
                error: "Invalid evidence id",
            });
        }
        if (!caseId) {
            return res.status(400).json({
                error: "caseId is required",
            });
        }
        await (0, evidenceService_2.restoreEvidence)(evidenceId);
        await (0, custodyService_1.createCustodyLog)({
            caseId,
            evidenceId,
            action: "RESTORE",
            user: user || "Investigator",
            reason,
        });
        return res.json({
            success: true,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to restore evidence",
        });
    }
}
