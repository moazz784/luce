import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { login, register } from "./authService";
import { api } from "./Api";
import { hasAdminRole } from "./jwtUtils";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerAllowed, setRegisterAllowed] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    api("/api/auth/registration-status", { method: "GET" })
      .then((d) => {
        if (!cancelled) setRegisterAllowed(!!d?.allowRegister);
      })
      .catch(() => {
        // Older deployments without this route return 404 — still show Register; POST /register enforces Auth:AllowRegister.
        if (!cancelled) setRegisterAllowed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (registerAllowed === false && !isLogin) setIsLogin(true);
  }, [registerAllowed, isLogin]);

  const validationSchema = Yup.object({
    name: isLogin
      ? Yup.string()
      : Yup.string().required("الاسم مطلوب"),
    email: Yup.string()
      .email("بريد إلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب"),
    password: Yup.string()
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),
    confirmPassword: isLogin
      ? Yup.string()
      : Yup.string()
          .oneOf([Yup.ref("password")], "كلمات المرور غير متطابقة")
          .required("تأكيد كلمة المرور مطلوب"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        if (isLogin) {
          await login(values.email, values.password);
          const token = localStorage.getItem("token");
          navigate(
            hasAdminRole(token) ? "/AdminDashboard" : "/",
            { replace: true },
          );
        } else {
          await register(values.name, values.email, values.password);
          
          // بعد التسجيل، بنحوله لوضع اللوجين ونصفر الفورم
          setIsLogin(true);
          formik.resetForm();
          alert("تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن");
        }
      } catch (err) {
        // هنا الـ err.message هي اللي جاية من الـ Api.js (زي "كلمة السر خطأ")
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2138] via-[#0f2a44] to-[#152f4a] flex items-center justify-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0f2a44]/80"></div>

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[350px] text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-gray-200 mb-6">
          {isLogin ? "Login to your account" : "Sign up to get started"}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-400 text-xs mt-1 text-left">{formik.errors.name}</p>
              )}
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-400 text-xs mt-1 text-left">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-400 text-xs mt-1 text-left">{formik.errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 text-left">{formik.errors.confirmPassword}</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 p-2 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition disabled:bg-gray-500"
          >
            {loading ? "جاري التحميل..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-4 min-h-[1.25rem]">
          {registerAllowed !== false ? (
            <>
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <span
                className="text-green-400 cursor-pointer hover:underline font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  formik.resetForm();
                }}
              >
                {isLogin ? "Register" : "Login"}
              </span>
            </>
          ) : (
            <span className="text-gray-400">
              New accounts are disabled. Contact an administrator.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
