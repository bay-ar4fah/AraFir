import { Users } from "lucide-react";

interface Props {
  investigator?: string;
  assignedBy?: string;
  assignedAt?: string;
}

export default function CaseAssignmentCard({
  investigator = "-",
  assignedBy = "-",
  assignedAt = "-",
}: Props) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-lg shadow-black/20">
      <div className="mb-5 flex items-center gap-3">
        <Users className="text-cyan-300" size={22} />
        <h2 className="text-lg font-bold text-zinc-100">
          Case Assignment
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        <Info label="Assigned Investigator" value={investigator} />
        <Info label="Assigned By" value={assignedBy} />
        <Info label="Assigned At" value={assignedAt} />
        <Info label="Current Responsibility" value="Investigation & Analysis" />
      </div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-zinc-100">
        {value}
      </p>
    </div>
  );
}