/** ASP.NET Core JWT role claims (ClaimTypes.Role) */
const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

const ROLES_SESSION_KEY = "luce_roles";

/**
 * @returns {string[]}
 */
export function loadRolesFromSession() {
  try {
    const raw = sessionStorage.getItem(ROLES_SESSION_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(String) : [];
  } catch {
    return [];
  }
}

/**
 * @param {string[]} roles
 */
export function saveRolesToSession(roles) {
  if (!Array.isArray(roles)) return;
  sessionStorage.setItem(ROLES_SESSION_KEY, JSON.stringify(roles));
}

export function clearAuthSession() {
  sessionStorage.removeItem(ROLES_SESSION_KEY);
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("email");
  try {
    localStorage.removeItem("token");
  } catch {
    /* ignore */
  }
}

/**
 * @param {string | null | undefined} token JWT access token (optional; HttpOnly cookie flow uses session roles)
 * @returns {string[]}
 */
export function getRolesFromToken(token) {
  if (!token || typeof token !== "string") return [];
  try {
    const parts = token.split(".");
    if (parts.length < 2) return [];
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    const obj = JSON.parse(json);
    const raw = obj[ROLE_CLAIM] ?? obj.role;
    if (raw == null) return [];
    if (Array.isArray(raw)) return raw.map(String);
    return [String(raw)];
  } catch {
    return [];
  }
}

/**
 * @param {string | null | undefined} token If provided, decode JWT; otherwise use session roles from / login.
 */
export function hasAdminRole(token) {
  if (token != null && token !== "")
    return getRolesFromToken(token).includes("Admin");
  return loadRolesFromSession().includes("Admin");
}
