import {
  Calendar,
  Cpu,
  User,
} from "lucide-react";

interface CaseContextCardProps {
  investigationType?: string;
  priority?: string;
  investigator?: string;
  lastImport?: string;
}

export default function CaseContextCard({
  investigationType = "Memory Forensics",
  priority = "Medium",
  investigator = "-",
  lastImport = "-",
}: CaseContextCardProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 shadow-lg shadow-black/20 md:grid-cols-4">
      <ContextItem
        icon={<Cpu size={18} />}
        label="Investigation Type"
        value={investigationType}
      />

      <ContextItem
        icon={<span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />}
        label="Priority"
        value={priority}
      />

      <ContextItem
        icon={<User size={18} />}
        label="Investigator"
        value={investigator}
      />

      <ContextItem
        icon={<Calendar size={18} />}
        label="Last Import"
        value={lastImport}
      />
    </div>
  );
}

function ContextItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-zinc-800 md:border-r md:last:border-r-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-cyan-300">
        {icon}
      </div>

      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="mt-1 text-sm font-semibold text-zinc-100">
          {value}
        </p>
      </div>
    </div>
  );
}