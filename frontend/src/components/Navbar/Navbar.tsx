import { useEffect, useState } from "react";

import type {
  SystemStatus,
} from "../../types/status";

import {
  getSystemStatus,
} from "../../services/statusService";

import { useAuth } from "../../context/AuthContext";

import {
  formatRoleLabel,
  getInitials,
} from "../../utils/roleUtils";

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

  const displayRole =
    user?.roleLabel ||
    formatRoleLabel(user?.role ?? "");

  const initials =
    getInitials(user?.name);

  return (
    <header
      className="
        h-16
        border-b
        border-zinc-800
        flex
        items-center
        justify-between
        px-6
        bg-black
        text-white
      "
    >
      <div>
        <h1 className="font-semibold text-lg">
          Digital Forensics Dashboard
        </h1>

        <p className="text-xs text-zinc-500">
          AraFir DFIR Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`
            px-4
            py-2
            rounded-xl
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
            <span>
              Platform Offline
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <span>
                Investigation Active
              </span>

              <span className="text-zinc-500">
                |
              </span>

              <span>
                Cases:{" "}
                {status?.casesCount ?? 0}
              </span>

              <span>
                Evidence:{" "}
                {status?.evidenceCount ?? 0}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-zinc-800 pl-4">
          <div
            className="
              h-10
              w-10
              rounded-full
              border
              border-cyan-500/40
              bg-cyan-500/10
              flex
              items-center
              justify-center
              text-sm
              font-bold
              text-cyan-300
            "
          >
            {initials}
          </div>

          <div className="text-right text-sm">
            <p className="font-semibold text-white">
              {user?.name ??
                "AraFir User"}
            </p>

            <p className="text-xs text-cyan-400">
              {displayRole}
            </p>
          </div>

          <button
            onClick={logout}
            className="
              ml-2
              rounded-lg
              border
              border-zinc-700
              px-3
              py-2
              text-sm
              text-zinc-300
              hover:bg-zinc-800
              hover:text-white
              transition
            "
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}