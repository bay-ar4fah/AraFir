import { useEffect, useState } from "react";

import type {
  SystemStatus,
} from "../../types/status";

import {
  getSystemStatus,
} from "../../services/statusService";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [status, setStatus] =
    useState<SystemStatus | null>(null);

  const [isOffline, setIsOffline] =
    useState(false);

  useEffect(() => {
    const loadStatus = () => {
      getSystemStatus()
        .then((data) => {
          setStatus(data);
          setIsOffline(false);
        })
        .catch(() => {
          setIsOffline(true);
        });
    };

    loadStatus();

    const interval = setInterval(
      loadStatus,
      10000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-black text-white">
      <h1 className="font-semibold">
        Digital Forensics Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <div
          className={`
            px-4
            py-2
            rounded-lg
            border
            text-sm
            font-medium
            ${
              isOffline
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : "bg-green-500/10 text-green-400 border-green-500/30"
            }
          `}
        >
          {isOffline ? (
            <span>Offline</span>
          ) : (
            <div className="flex items-center gap-3">
              <span>
                Investigation Active
              </span>

              <span className="text-zinc-500">
                |
              </span>

              <span>
                Cases: {status?.casesCount ?? 0}
              </span>

              <span>
                Evidence: {status?.evidenceCount ?? 0}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-zinc-800 pl-4">
          <div className="text-right text-sm">
            <div className="font-medium text-white">
              {user?.name ?? "Unknown User"}
            </div>

            <div className="text-xs text-zinc-400">
              {user?.role ?? "NO_ROLE"}
            </div>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}