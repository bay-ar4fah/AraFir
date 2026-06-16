"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCases = getCases;
exports.createCase = createCase;
exports.getCaseById = getCaseById;
exports.deleteCaseCascade = deleteCaseCascade;
exports.getAssignableUserById = getAssignableUserById;
exports.reassignCase = reassignCase;
const db_1 = require("../database/db");
function getCases() {
    return new Promise((resolve, reject) => {
        db_1.db.all(`SELECT * FROM cases ORDER BY createdAt DESC`, [], (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}
function createCase(params) {
    return new Promise((resolve, reject) => {
        db_1.db.run(`
      INSERT INTO cases (
        id,
        caseName,
        description,
        createdAt,
        investigator,
        investigatorId,
        investigatorName,
        assignedByUserId,
        assignedByName,
        assignedAt,
        status
      ) VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
      `, [
            params.id,
            params.caseName,
            params.description,
            params.investigatorName,
            params.investigatorId,
            params.investigatorName,
            params.assignedByUserId,
            params.assignedByName,
            params.status,
        ], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
function getCaseById(id) {
    return new Promise((resolve, reject) => {
        db_1.db.get(`
      SELECT *
      FROM cases
      WHERE id = ?
      `, [id], (err, row) => {
            if (err)
                return reject(err);
            resolve(row || null);
        });
    });
}
function deleteCaseCascade(caseId) {
    return new Promise((resolve, reject) => {
        db_1.db.serialize(() => {
            db_1.db.run(`DELETE FROM evidence WHERE caseId = ?`, [caseId]);
            db_1.db.run(`DELETE FROM timeline_events WHERE caseId = ?`, [caseId]);
            db_1.db.run(`DELETE FROM mitre_findings WHERE caseId = ?`, [caseId]);
            db_1.db.run(`DELETE FROM custody_logs WHERE caseId = ?`, [caseId]);
            db_1.db.run(`DELETE FROM cases WHERE id = ?`, [caseId], (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    });
}
function getAssignableUserById(userId) {
    return new Promise((resolve, reject) => {
        db_1.db.get(`
      SELECT id, name, email, role
      FROM users
      WHERE id = ?
        AND is_active = 1
        AND role IN ('DFIR_MANAGER', 'INVESTIGATOR')
      `, [userId], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}
function reassignCase(params) {
    return new Promise((resolve, reject) => {
        db_1.db.run(`
      UPDATE cases
      SET
        investigator = ?,
        investigatorId = ?,
        investigatorName = ?,
        assignedByUserId = ?,
        assignedByName = ?,
        assignedAt = CURRENT_TIMESTAMP
      WHERE id = ?
      `, [
            params.investigatorName,
            params.investigatorId,
            params.investigatorName,
            params.assignedByUserId,
            params.assignedByName,
            params.caseId,
        ], (err) => {
            if (err)
                reject(err);
            else
                resolve();
        });
    });
}
