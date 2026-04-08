import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "./Api";
import { saveRolesToSession } from "./jwtUtils";

export default function ProtectedRoute({ children }) {
  const [state, setState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    api("/api/auth/me", { method: "GET" })
      .then((me) => {
        if (cancelled) return;
        const roles = me.roles ?? [];
        saveRolesToSession(roles);
        if (roles.includes("Admin")) setState("admin");
        else setState("user");
      })
      .catch(() => {
        if (!cancelled) setState("unauth");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") return null;
  if (state === "unauth") return <Navigate to="/login" replace />;
  if (state === "user") return <Navigate to="/" replace />;
  return children;
}
