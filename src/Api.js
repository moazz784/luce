const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://luce.runasp.net";

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  // التأكد من أن الـ endpoint بيبدأ بـ /
  const url = endpoint.startsWith("/") ? `${BASE_URL}${endpoint}` : `${BASE_URL}/${endpoint}`;

  const fetchOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers, // عشان لو حبيت تضيف headers تانية في أي طلب معين
    },
  };

  // لو باعت body في الـ options، بنحوله لـ string تلقائياً
  if (options.body && typeof options.body === "object") {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);

  // معالجة حالة الـ 204 (No Content) عشان ميعملش crash لو الـ API مردش ببيانات
  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // إظهار رسالة الخطأ من الـ API (ProblemDetails) أو رسالة افتراضية
    const errorMsg = data?.detail || data?.title || "حدث خطأ ما";
    throw new Error(errorMsg);
  }

  return data;
};