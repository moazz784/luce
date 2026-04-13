import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "./Api";
import { logout } from "./authService";
import { clearAuthSession, saveRolesToSession } from "./jwtUtils";

export function useSiteAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountLabel, setAccountLabel] = useState(() => {
    try {
      return (
        sessionStorage.getItem("userName") ||
        sessionStorage.getItem("email") ||
        ""
      );
    } catch {
      return "";
    }
  });

  const refreshAuth = useCallback(() => {
    let cancelled = false;
    api("/api/auth/me", { method: "GET" })
      .then((me) => {
        if (cancelled) return;

        const rolesRaw = me.roles ?? [];
        const roles = Array.isArray(rolesRaw)
          ? rolesRaw.map((r) => r.toLowerCase())
          : [];

        saveRolesToSession(roles);

        const uname = me.userName ?? me.UserName ?? "";
        const em = me.email ?? me.Email ?? "";

        if (uname) sessionStorage.setItem("userName", uname);
        if (em) sessionStorage.setItem("email", em);

        setAccountLabel(uname || em || "");
        setIsLoggedIn(true);
        setIsAdmin(roles.includes("admin"));
      })
      .catch(() => {
        if (cancelled) return;
        setIsLoggedIn(false);
        setIsAdmin(false);
        setAccountLabel("");
        clearAuthSession();
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const cleanup = refreshAuth();
    return cleanup;
  }, [location.pathname, refreshAuth]);

  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) refreshAuth();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [refreshAuth]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  return {
    isLoggedIn,
    isAdmin,
    accountLabel,
    handleLogout,
  };
}
