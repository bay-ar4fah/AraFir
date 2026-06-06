"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvidence = getEvidence;
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
function createEvidence(evidence) {
    return new Promise((resolve, reject) => {
        db_1.db.run(`
        INSERT INTO evidence
        (
          id,
          filename,
          fileType,
          size,
          sha256,
          importedAt,
          importedBy
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
        `, [
            evidence.id,
            evidence.filename,
            evidence.fileType,
            evidence.size,
            evidence.sha256,
            evidence.importedAt,
            evidence.importedBy
        ], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
