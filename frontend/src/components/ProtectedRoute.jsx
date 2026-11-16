import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth.jsx";

export default function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
