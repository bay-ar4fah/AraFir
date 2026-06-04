import type { CustodyLog } from "../types/custody";
import custodyData from "../mocks/custody.json";

let logs: CustodyLog[] = custodyData as CustodyLog[];

export async function getCustodyLogs() {
  return logs;
}

export async function addCustodyLog(log: CustodyLog) {
  logs = [log, ...logs];
  return log;
}