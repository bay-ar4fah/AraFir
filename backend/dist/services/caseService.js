"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCases = getCases;
exports.createCase = createCase;
exports.getCaseById = getCaseById;
exports.deleteCaseCascade = deleteCaseCascade;
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
function createCase(forensicCase) {
    return new Promise((resolve, reject) => {
        db_1.db.run(`
      INSERT INTO cases (
        id,
        caseName,
        description,
        createdAt,
        investigator,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `, [
            forensicCase.id,
            forensicCase.caseName,
            forensicCase.description,
            forensicCase.createdAt,
            forensicCase.investigator,
            forensicCase.status
        ], (err) => {
            if (err)
                return reject(err);
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
