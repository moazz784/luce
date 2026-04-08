// - Production (Vercel): use https API (set VITE_API_BASE_URL or default below).
// - Local dev: leave VITE_API_BASE_URL unset to use same-origin `/api/...`; Vite proxies to ASP.NET (see vite.config.js).
// - Or set VITE_API_BASE_URL=http://localhost:5009 to call the API directly.
const envBase = import.meta.env.VITE_API_BASE_URL;
const BASE_URL =
  envBase != null && envBase !== ""
    ? envBase
    : import.meta.env.DEV
      ? ""
      : "https://luce.runasp.net";

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const url = endpoint.startsWith("/") ? `${BASE_URL}${endpoint}` : `${BASE_URL}/${endpoint}`;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const fetchOptions = {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (!isFormData && options.body && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg = data?.detail || data?.title || "حدث خطأ ما";
    throw new Error(errorMsg);
  }

  return data;
};

/** Multipart upload for admin media; returns `{ url }` from the API. */
export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api("/api/admin/media", {
    method: "POST",
    body: formData,
  });
};
