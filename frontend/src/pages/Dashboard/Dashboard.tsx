import { useEffect, useState } from "react";

import StatCard from "../../components/Cards/StatCard";

import { getDashboardStats } from "../../services/dashboardService";

import type { DashboardStats } from "../../types/dashboard";

export default function Dashboard() {

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);
  
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Events"
          value={stats?.totalEvents?.toLocaleString() ?? "0"}
        />

        <StatCard
          title="IOC Matches"
          value={stats?.iocMatches?.toString() ?? "0"}
        />

        <StatCard
          title="MITRE TTPs"
          value={stats?.mitreTechniques?.toString() ?? "0"}
        />

        <StatCard
          title="Threat Score"
          value={`${stats?.threatScore ?? 0}%`}
        />
      </div>

      <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
        Recent Activity
      </div>
    </div>
  );
}