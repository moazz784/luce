import { Navigate } from "react-router-dom";
import { hasAdminRole } from "./jwtUtils";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAdminRole(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
}