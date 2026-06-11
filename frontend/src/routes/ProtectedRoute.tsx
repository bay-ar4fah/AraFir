import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const {
    isAuthenticated,
    user,
  } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.mustChangePassword) {
    return (
      <Navigate
        to="/force-change-password"
        replace
      />
    );
  }

  return <Outlet />;
}