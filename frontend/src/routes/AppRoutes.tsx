import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage/LoginPage";

import Dashboard from "../pages/Dashboard/Dashboard";
import Timeline from "../pages/Timeline/Timeline";
import Evidence from "../pages/Evidence/Evidence";
import AttackGraph from "../pages/AttackGraph/AttackGraph";
import MitrePage from "../pages/Mitre/Mitre";
import Reports from "../pages/Reports/Reports";
import CorrelationPage from "../pages/Correlation/Correlation";
import CasesPage from "../pages/Cases/Cases";
import CaseWorkspace from "../pages/Cases/CaseWorkspace";
import CaseAttackGraph from "../pages/Cases/CaseAttackGraph";
import UserManagement from "../pages/Users/UserManagement";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Route */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/timeline"
          element={<Timeline />}
        />

        <Route
          path="/evidence"
          element={<Evidence />}
        />

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

        <Route
          path="/cases/:caseId/graph"
          element={<CaseAttackGraph />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
            path="/users"
            element={<UserManagement />}
          />
      </Route>

    </Routes>
  );
}