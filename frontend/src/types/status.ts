export interface SystemStatus {
  status: "READY" | "OFFLINE";
  database: "CONNECTED" | "ERROR";
  casesCount: number;
  evidenceCount: number;
  timestamp: string;
}