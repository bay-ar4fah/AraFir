"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCases = listCases;
exports.addCase = addCase;
exports.detailCase = detailCase;
exports.deleteCase = deleteCase;
const caseService_1 = require("../services/caseService");
const auditService_1 = require("../services/auditService");
const auditUtils_1 = require("../utils/auditUtils");
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
        await (0, auditService_1.createAuditLog)({
            ...(0, auditUtils_1.getAuditActor)(req),
            action: "CASE_CREATED",
            entityType: "CASE",
            entityId: req.body.id,
            entityName: req.body.name,
            message: "Case created successfully",
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Failed to create case"
        });
    }
}
async function detailCase(req, res) {
    try {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid case id"
            });
        }
        const data = await (0, caseService_1.getCaseById)(id);
        if (!data) {
            return res.status(404).json({
                error: "Case not found"
            });
        }
        return res.json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to load case"
        });
    }
}
async function deleteCase(req, res) {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid case id",
            });
        }
        await (0, caseService_1.deleteCaseCascade)(id);
        return res.json({
            success: true,
            message: "Case deleted successfully",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to delete case",
        });
    }
}
