import { db } from "../database/db";

export interface SystemStatus {
  status: "READY";
  database: "CONNECTED";
  casesCount: number;
  evidenceCount: number;
  timestamp: string;
}

export function getSystemStatus(): Promise<SystemStatus> {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT
        (SELECT COUNT(*) FROM cases) as casesCount,
        (SELECT COUNT(*) FROM evidence) as evidenceCount
      `,
      [],
      (
        err: Error | null,
        row: {
          casesCount: number;
          evidenceCount: number;
        }
      ) => {
        if (err) return reject(err);

        resolve({
          status: "READY",
          database: "CONNECTED",
          casesCount: row.casesCount,
          evidenceCount: row.evidenceCount,
          timestamp: new Date().toISOString(),
        });
      }
    );
  });
}