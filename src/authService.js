import { api } from "./Api";

export const login = async (email, password) => {
  try {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password }, // بنبعته كـ Object والـ Api.js هيحوله لـ string
    });

    // حفظ البيانات المهمة في الـ localStorage
    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("userName", data.userName);
      localStorage.setItem("email", data.email);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    return await api("/api/auth/register", {
      method: "POST",
      body: {
        userName: name,
        email,
        password,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  // مسح كل البيانات المسجلة للخروج
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  localStorage.removeItem("email");
  window.location.href = "/login"; // تحويل المستخدم لصفحة اللوجين
};

export const isAuthenticated = () => {
  // دالة سريعة للتأكد هل المستخدم مسجل دخول ولا لأ
  return !!localStorage.getItem("token");
};