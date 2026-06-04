import StatCard from "../../components/Cards/StatCard";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Events" value="12,451" />
        <StatCard title="IOC Matches" value="27" />
        <StatCard title="MITRE TTPs" value="14" />
        <StatCard title="Threat Score" value="92%" />
      </div>

      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        Recent Activity
      </div>
    </div>
  );
}