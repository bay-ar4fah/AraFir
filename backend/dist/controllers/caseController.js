"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCases = listCases;
exports.addCase = addCase;
exports.detailCase = detailCase;
exports.deleteCase = deleteCase;
exports.reassignCaseById = reassignCaseById;
exports.listCaseAssignments = listCaseAssignments;
const crypto_1 = require("crypto");
const caseService_1 = require("../services/caseService");
const caseAssignmentService_1 = require("../services/caseAssignmentService");
const caseService_2 = require("../services/caseService");
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
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
        const { caseName, description, investigatorId, } = req.body;
        if (!caseName || !investigatorId) {
            return res.status(400).json({
                error: "caseName and investigatorId are required",
            });
        }
        const assignedUser = await (0, caseService_1.getAssignableUserById)(investigatorId);
        if (!assignedUser) {
            return res.status(400).json({
                error: "Selected investigator is invalid or inactive",
            });
        }
        const caseId = (0, crypto_1.randomUUID)();
        await (0, caseService_1.createCase)({
            id: caseId,
            caseName,
            description,
            investigatorId: assignedUser.id,
            investigatorName: assignedUser.name,
            assignedByUserId: req.user.id,
            assignedByName: req.user.name,
            status: "OPEN",
        });
        await (0, caseAssignmentService_1.createCaseAssignmentLog)({
            caseId,
            assignedToUserId: assignedUser.id,
            assignedToName: assignedUser.name,
            assignedToRole: assignedUser.role,
            assignedByUserId: req.user.id,
            assignedByName: req.user.name,
            assignedByRole: req.user.role,
            action: "ASSIGNED",
            reason: "Initial case assignment",
        });
        return res.status(201).json({
            success: true,
            caseId,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to create case",
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
async function reassignCaseById(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }
        const { id } = req.params;
        const { investigatorId, reason, } = req.body;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid case id",
            });
        }
        if (!investigatorId) {
            return res.status(400).json({
                error: "investigatorId is required",
            });
        }
        const assignedUser = await (0, caseService_1.getAssignableUserById)(investigatorId);
        if (!assignedUser) {
            return res.status(400).json({
                error: "Selected investigator is invalid or inactive",
            });
        }
        await (0, caseService_2.reassignCase)({
            caseId: id,
            investigatorId: assignedUser.id,
            investigatorName: assignedUser.name,
            assignedByUserId: req.user.id,
            assignedByName: req.user.name,
        });
        await (0, caseAssignmentService_1.createCaseAssignmentLog)({
            caseId: id,
            assignedToUserId: assignedUser.id,
            assignedToName: assignedUser.name,
            assignedToRole: assignedUser.role,
            assignedByUserId: req.user.id,
            assignedByName: req.user.name,
            assignedByRole: req.user.role,
            action: "REASSIGNED",
            reason: reason || "Case reassigned",
        });
        return res.json({
            success: true,
            message: "Case reassigned successfully",
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to reassign case",
        });
    }
}
async function listCaseAssignments(req, res) {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({
                error: "Invalid case id",
            });
        }
        const logs = await (0, caseAssignmentService_1.getCaseAssignmentLogs)(id);
        return res.json(logs);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Failed to load assignment history",
        });
    }
}
