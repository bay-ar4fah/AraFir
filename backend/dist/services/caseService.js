"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCases = getCases;
exports.createCase = createCase;
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
