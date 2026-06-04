import custodyData from "../mocks/custody.json";
import type { CustodyLog } from "../types/custody";

let logs: CustodyLog[] = custodyData;

export async function getCustodyLogs() {
  return logs;
}

export async function addCustodyLog(
  log: CustodyLog
) {
  logs = [log, ...logs];
  return log;
}