"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCases = listCases;
exports.addCase = addCase;
exports.detailCase = detailCase;
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
