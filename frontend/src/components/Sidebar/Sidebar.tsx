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
} from "lucide-react";

import { NavLink } from "react-router-dom";

import PermissionGuard from "../Auth/PermissionGuard";
import { useAuth } from "../../context/AuthContext";

import {
  formatRoleLabel,
  getInitials,
} from "../../utils/roleUtils";

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

export default function Sidebar() {
  const { user } = useAuth();

  const displayRole =
    user?.roleLabel ||
    formatRoleLabel(user?.role ?? "");

  const initials =
    getInitials(user?.name);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="px-5 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">
            A
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-wide text-white">
              AraFir
            </h1>

            <p className="text-xs text-zinc-500">
              DFIR Platform
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-5 overflow-y-auto scrollbar-hide">
        <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Menu
        </p>

        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-lg
              transition
              ${
                isActive
                  ? "bg-cyan-600 text-white"
                  : "hover:bg-zinc-900 text-zinc-300"
              }
              `
            }
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-zinc-800">
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Admin
          </p>

          <PermissionGuard permission="user:manage">
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                transition
                ${
                  isActive
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-zinc-900 text-zinc-300"
                }
                `
              }
            >
              <Users size={18} />
              <span>User Management</span>
            </NavLink>
          </PermissionGuard>

          <PermissionGuard permission="audit:read">
            <NavLink
              to="/audit"
              className={({ isActive }) =>
                `
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-lg
                transition
                ${
                  isActive
                    ? "bg-cyan-600 text-white"
                    : "hover:bg-zinc-900 text-zinc-300"
                }
                `
              }
            >
              <ScrollText size={18} />
              <span>Audit Trail</span>
            </NavLink>
          </PermissionGuard>
        </div>
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-zinc-900/70 p-3">
          <div className="h-11 w-11 rounded-full border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center text-sm font-bold text-cyan-300">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {user?.name ?? "AraFir User"}
            </p>

            <p className="truncate text-xs text-cyan-400">
              {displayRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}