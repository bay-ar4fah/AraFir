import {
  LayoutDashboard,
  Clock3,
  FolderSearch,
  Network,
  Shield,
  FileText,
  Users,
  BriefcaseBusiness,
  ScrollText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import PermissionGuard from "../Auth/PermissionGuard";
import { useAuth } from "../../context/AuthContext";

import {
  formatRoleLabel,
  getInitials,
} from "../../utils/roleUtils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Cases",
    path: "/cases",
    icon: BriefcaseBusiness,
  },
  {
    name: "Evidence",
    path: "/evidence",
    icon: FolderSearch,
  },
  {
    name: "Timeline",
    path: "/timeline",
    icon: Clock3,
  },
  {
    name: "Attack Graph",
    path: "/attack-graph",
    icon: Network,
  },
  {
    name: "MITRE",
    path: "/mitre",
    icon: Shield,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FileText,
  },
];

export default function Sidebar({
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const { user } = useAuth();

  const displayRole =
    user?.roleLabel ||
    formatRoleLabel(user?.role ?? "");

  const initials =
    getInitials(user?.name);

  const navClass = (isActive: boolean) =>
    `
    flex
    items-center
    gap-3
    px-4
    py-3
    rounded-lg
    transition
    ${isCollapsed ? "justify-center" : ""}
    ${
      isActive
        ? "bg-cyan-600 text-white"
        : "hover:bg-zinc-900 text-zinc-300"
    }
    `;

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r border-zinc-800 bg-zinc-950 flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="px-4 py-5 border-b border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 shrink-0 rounded-xl border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">
              A
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-wide text-white">
                  AraFir
                </h1>

                <p className="text-xs text-zinc-500">
                  DFIR Platform
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={onToggle}
              className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button
            onClick={onToggle}
            className="mt-4 w-full rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
            title="Expand sidebar"
          >
            <PanelLeftOpen size={16} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-3 py-5 overflow-y-auto scrollbar-hide">
        {!isCollapsed && (
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Menu
          </p>
        )}

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              navClass(isActive)
            }
          >
            <item.icon size={18} />

            {!isCollapsed && (
              <span>{item.name}</span>
            )}
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-zinc-800">
          {!isCollapsed && (
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Admin
            </p>
          )}

          <PermissionGuard permission="user:manage">
            <NavLink
              to="/users"
              title={
                isCollapsed
                  ? "User Management"
                  : undefined
              }
              className={({ isActive }) =>
                navClass(isActive)
              }
            >
              <Users size={18} />

              {!isCollapsed && (
                <span>User Management</span>
              )}
            </NavLink>
          </PermissionGuard>

          <PermissionGuard permission="audit:read">
            <NavLink
              to="/audit"
              title={
                isCollapsed
                  ? "Audit Trail"
                  : undefined
              }
              className={({ isActive }) =>
                navClass(isActive)
              }
            >
              <ScrollText size={18} />

              {!isCollapsed && (
                <span>Audit Trail</span>
              )}
            </NavLink>
          </PermissionGuard>
        </div>
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div
          className={`flex items-center gap-3 rounded-xl bg-zinc-900/70 p-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="h-11 w-11 shrink-0 rounded-full border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-sm font-bold text-cyan-300">
            {initials}
          </div>

          {!isCollapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ?? "AraFir User"}
              </p>

              <p className="truncate text-xs text-cyan-400">
                {displayRole}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}