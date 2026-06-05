import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Timeline from "../pages/Timeline/Timeline";
import Evidence from "../pages/Evidence/Evidence";
import AttackGraph from "../pages/AttackGraph/AttackGraph";
import MitrePage from "../pages/Mitre/Mitre";
import Reports from "../pages/Reports/Reports";
import CorrelationPage from "../pages/Correlation/Correlation";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/evidence" element={<Evidence />} />
      <Route
        path="/attack-graph"
        element={<AttackGraph />}
      />
      <Route
        path="/mitre"
        element={<MitrePage />}
      />
      <Route
        path="/correlation"
        element={<CorrelationPage />}
      />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}