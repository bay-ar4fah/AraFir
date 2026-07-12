import {
  Calendar,
  CheckCircle,
  Shield,
  User,
} from "lucide-react";

interface Props {
  investigator?: string;
  createdAt?: string;
  assignedBy?: string;
  assignedAt?: string;
  status?: string;
  type?: string;
  priority?: string;
}

export default function CaseSummaryCard({
  investigator = "-",
  createdAt = "-",
  assignedBy = "-",
  assignedAt = "-",
  status = "OPEN",
  type = "MULTI SOURCE",
  priority = "MEDIUM",
}: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center gap-3">
        <Shield className="text-zinc-300" size={22} />
        <h2 className="text-lg font-bold text-zinc-100">
          Case Summary
        </h2>
      </div>

      <div className="space-y-4">
        <SummaryRow icon={<User size={16} />} label="Investigator" value={investigator} />
        <SummaryRow icon={<Calendar size={16} />} label="Created" value={createdAt} />
        <SummaryRow icon={<User size={16} />} label="Assigned By" value={assignedBy} />
        <SummaryRow icon={<Calendar size={16} />} label="Assigned At" value={assignedAt} />
        <SummaryRow icon={<CheckCircle size={16} />} label="Status" value={status} valueClass="text-emerald-300" />
        <SummaryRow icon={<Shield size={16} />} label="Type" value={type} />
        <SummaryRow icon={<span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />} label="Priority" value={priority} />
      </div>
    </section>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  valueClass = "text-zinc-100",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-3 text-zinc-500">
        {icon}
        <span>{label}</span>
      </div>

      <span className={`text-right font-semibold ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}