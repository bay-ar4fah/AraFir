import { useEffect, useState } from "react";
import type { CustodyLog } from "../../types/custody";
import { getCustodyLogs } from "../../services/chainOfCustodyService";

export default function CustodyPanel() {
  const [logs, setLogs] = useState<CustodyLog[]>([]);

  useEffect(() => {
    getCustodyLogs().then(setLogs);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-4">
        Chain of Custody
      </h2>

      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log.id}
            className="text-sm text-zinc-300 border-b border-zinc-800 pb-2"
          >
            <span className="text-blue-400">
              {log.action}
            </span>{" "}
            | Evidence: {log.evidenceId} | {log.user} |{" "}
            {log.timestamp}
          </div>
        ))}
      </div>
    </div>
  );
}