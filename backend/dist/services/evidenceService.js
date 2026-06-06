"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvidence = getEvidence;
exports.getEvidenceByCaseId = getEvidenceByCaseId;
exports.createEvidence = createEvidence;
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
        importedBy
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
            evidence.id,
            evidence.caseId,
            evidence.filename,
            evidence.fileType,
            evidence.size,
            evidence.sha256,
            evidence.importedAt,
            evidence.importedBy,
        ], (err) => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}
