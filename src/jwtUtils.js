/** ASP.NET Core JWT role claims (ClaimTypes.Role) */
const ROLE_CLAIM =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

/**
 * @param {string | null | undefined} token JWT access token
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
 * @param {string | null | undefined} token JWT access token
 */
export function hasAdminRole(token) {
  return getRolesFromToken(token).includes("Admin");
}
