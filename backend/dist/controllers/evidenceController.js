"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listEvidence = listEvidence;
exports.addEvidence = addEvidence;
exports.listEvidenceByCase = listEvidenceByCase;
exports.excludeEvidenceById = excludeEvidenceById;
exports.restoreEvidenceById = restoreEvidenceById;
const evidenceService_1 = require("../services/evidenceService");
const custodyService_1 = require("../services/custodyService");
const auditService_1 = require("../services/auditService");
const auditUtils_1 = require("../utils/auditUtils");
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
        const { caseId, reason } = req.body;
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
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
        const actor = `${req.user.name} (${req.user.role})`;
        await (0, evidenceService_1.excludeEvidence)({
            evidenceId,
            excludedBy: actor,
            reason,
        });
        await (0, auditService_1.createAuditLog)({
            ...(0, auditUtils_1.getAuditActor)(req),
            action: "EVIDENCE_EXCLUDED",
            entityType: "EVIDENCE",
            entityId: evidenceId,
            caseId,
            message: "Evidence excluded from active analysis",
            metadata: {
                reason,
            },
        });
        await (0, custodyService_1.createCustodyLog)({
            caseId,
            evidenceId,
            action: "EXCLUDE",
            user: actor,
            reason,
        });
        return res.json({
            success: true,
            excludedBy: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
            reason,
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
        const { caseId, reason } = req.body;
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
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
        const actor = `${req.user.name} (${req.user.role})`;
        const restoreReason = reason?.trim() || "Evidence restored";
        await (0, evidenceService_1.restoreEvidence)(evidenceId);
        await (0, auditService_1.createAuditLog)({
            ...(0, auditUtils_1.getAuditActor)(req),
            action: "EVIDENCE_RESTORED",
            entityType: "EVIDENCE",
            entityId: evidenceId,
            caseId,
            message: "Evidence restored to active analysis",
            metadata: {
                reason: restoreReason,
            },
        });
        await (0, custodyService_1.createCustodyLog)({
            caseId,
            evidenceId,
            action: "RESTORE",
            user: actor,
            reason: restoreReason,
        });
        return res.json({
            success: true,
            restoredBy: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
            reason: restoreReason,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to restore evidence",
        });
    }
}
