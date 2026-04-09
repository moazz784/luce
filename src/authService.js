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

function saveAuthResponse(data) {
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
  if (!pickAccessToken(data) && roles.length === 0) {
    console.warn(
      "Auth response missing token body and roles (cookie may still be set).",
    );
  }
}

/** Login and admin accounts: any address ending with @must.edu.eg */
export function isMustLoginEmail(email) {
  return (
    typeof email === "string" &&
    email.trim().toLowerCase().endsWith("@must.edu.eg")
  );
}

/** Student self-registration: digits only before @ */
export function isStudentMustEmail(email) {
  return typeof email === "string" && /^\d+@must\.edu\.eg$/i.test(email.trim());
}

export const login = async (email, password) => {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });

  saveAuthResponse(data);
  return data;
};

/** Step 1: sends OTP to email (Brevo). Returns nothing useful (204). */
export const registerStart = async (name, email, password) => {
  await api("/api/auth/register/start", {
    method: "POST",
    body: { userName: name, email, password },
  });
};

/** Step 2: verify OTP and create account; sets session like login. */
export const registerVerify = async (email, otp, password) => {
  const data = await api("/api/auth/register/verify", {
    method: "POST",
    body: { email, otp, password },
  });
  saveAuthResponse(data);
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
