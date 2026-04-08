import { api } from "./Api";
import {
  clearAuthSession,
  loadRolesFromSession,
  saveRolesToSession,
} from "./jwtUtils";

function pickAccessToken(data) {
  return data?.accessToken ?? data?.AccessToken ?? "";
}

function pickRoles(data) {
  const r = data?.roles ?? data?.Roles;
  return Array.isArray(r) ? r.map(String) : [];
}

export const login = async (email, password) => {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const roles = pickRoles(data);
  saveRolesToSession(roles);
  if (data.userName != null)
    sessionStorage.setItem("userName", data.userName);
  if (data.email != null) sessionStorage.setItem("email", data.email);

  // Legacy cleanup; JWT is HttpOnly cookie now.
  try {
    localStorage.removeItem("token");
  } catch {
    /* ignore */
  }

  if (!pickAccessToken(data) && roles.length === 0) {
    console.warn("Login response missing token body and roles (cookie may still be set).");
  }

  return data;
};

export const register = async (name, email, password) => {
  const data = await api("/api/auth/register", {
    method: "POST",
    body: {
      userName: name,
      email,
      password,
    },
  });

  const roles = pickRoles(data);
  saveRolesToSession(roles);
  if (data.userName != null)
    sessionStorage.setItem("userName", data.userName);
  if (data.email != null) sessionStorage.setItem("email", data.email);

  try {
    localStorage.removeItem("token");
  } catch {
    /* ignore */
  }

  return data;
};

export const logout = async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch {
    /* still clear client state */
  }
  clearAuthSession();
  window.location.href = "/login";
};

export const isAuthenticated = () => loadRolesFromSession().length > 0;
