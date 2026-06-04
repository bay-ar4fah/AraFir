import {
  LayoutDashboard,
  Clock3,
  FolderSearch,
  Network,
  Shield,
  FileText,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Timeline", icon: Clock3 },
  { name: "Evidence", icon: FolderSearch },
  { name: "Attack Graph", icon: Network },
  { name: "MITRE", icon: Shield },
  { name: "Reports", icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800">
      <div className="p-6 text-xl font-bold text-cyan-400">
        AraFir
      </div>

      <nav className="space-y-2 px-3">
        {menu.map((item) => (
          <button
            key={item.name}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-900 transition"
          >
            <item.icon size={18} />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}