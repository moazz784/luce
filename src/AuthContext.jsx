import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from './Api'; // استدعاء ملف الـ Api بتاعك

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // دالة لجلب بيانات المستخدم الحالي من السيرفر
  const fetchUser = async () => {
    try {
      // Guide بتاعك بيقول نستخدم المسار ده عشان نجيب بيانات اليوزر
      const data = await api("/api/auth/me", { method: "GET" });
      
      if (data && data.userName) {
        setUser(data);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // أول ما الأبلكيشن يفتح، بنحاول نجيب اليوزر لو هو مسجل دخول أصلاً
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, fetchUser, setUser, setIsLoggedIn }}>
      {/* مش هنعرض التطبيق غير لما نخلص التأكد من حالة اليوزر أول مرة */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook بسيط عشان نستخدم الداتا دي في أي مكان بسهولة
export const useAuth = () => useContext(AuthContext);