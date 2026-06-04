import {
  LayoutDashboard,
  Clock3,
  FolderSearch,
  Network,
  Shield,
  FileText,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Timeline",
    path: "/timeline",
    icon: Clock3,
  },
  {
    name: "Evidence",
    path: "/evidence",
    icon: FolderSearch,
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
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800">
      <div className="p-6 text-xl font-bold text-cyan-400">
        AraFir
      </div>

      <nav className="space-y-2 px-3">
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
        </nav>
    </aside>
  );
}