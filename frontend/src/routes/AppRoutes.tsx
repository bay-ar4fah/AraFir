import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Timeline from "../pages/Timeline/Timeline";
import Evidence from "../pages/Evidence/Evidence";
import AttackGraph from "../pages/AttackGraph/AttackGraph";
import MitrePage from "../pages/Mitre/Mitre";
import Reports from "../pages/Reports/Reports";
import CorrelationPage from "../pages/Correlation/Correlation";
import CasesPage from "../pages/Cases/Cases";
import CaseWorkspace from "../pages/Cases/CaseWorkspace";

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
      <Route 
        path="/cases" 
        element={<CasesPage />} 
        />
      <Route
        path="/cases/:caseId"
        element={<CaseWorkspace />}
      />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  );
}