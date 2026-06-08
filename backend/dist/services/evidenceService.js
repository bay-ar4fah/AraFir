"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvidence = getEvidence;
exports.getEvidenceByCaseId = getEvidenceByCaseId;
exports.createEvidence = createEvidence;
exports.excludeEvidence = excludeEvidence;
exports.restoreEvidence = restoreEvidence;
const db_1 = require("../database/db");
function getEvidence() {
    return new Promise((resolve, reject) => {
        db_1.db.all(`
        SELECT *
        FROM evidence
        ORDER BY importedAt DESC
        `, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
function getEvidenceByCaseId(caseId) {
    return new Promise((resolve, reject) => {
        db_1.db.all(`
      SELECT *
      FROM evidence
      WHERE caseId = ?
      ORDER BY importedAt DESC
      `, [caseId], (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}
function createEvidence(evidence) {
    return new Promise((resolve, reject) => {
        db_1.db.run(`
      INSERT INTO evidence (
        id,
        caseId,
        filename,
        fileType,
        size,
        sha256,
        importedAt,
        importedBy,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            evidence.id,
            evidence.caseId,
            evidence.filename,
            evidence.fileType,
            evidence.size,
            evidence.sha256,
            evidence.importedAt,
            evidence.importedBy,
            evidence.status || "ACTIVE",
        ], (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}
function excludeEvidence(params) {
    return new Promise((resolve, reject) => {
        db_1.db.run(`
      UPDATE evidence
      SET
        status = 'EXCLUDED',
        excludedAt = ?,
        excludedBy = ?,
        excludeReason = ?
      WHERE id = ?
      `, [
            new Date().toISOString(),
            params.excludedBy,
            params.reason,
            params.evidenceId,
        ], (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}
function restoreEvidence(evidenceId) {
    return new Promise((resolve, reject) => {
        db_1.db.run(`
      UPDATE evidence
      SET
        status = 'ACTIVE',
        excludedAt = NULL,
        excludedBy = NULL,
        excludeReason = NULL
      WHERE id = ?
      `, [evidenceId], (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}
