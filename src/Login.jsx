import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, isMustLoginEmail } from "./authService";
import { hasAdminRole } from "./jwtUtils";

export default function Login({ switchToRegister, registerAllowed }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("بريد إلكتروني غير صحيح")
        .required("البريد الإلكتروني مطلوب")
        .test("must", "يجب استخدام بريد MUST (@must.edu.eg)", (v) => !!v && isMustLoginEmail(v)),
      password: Yup.string().required("كلمة المرور مطلوبة"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.email, values.password);
        toast.success("مرحباً بك مجدداً! جاري الدخول...");
        navigate(hasAdminRole() ? "/AdminDashboard" : "/", { replace: true });
      } catch (err) {
        toast.error(err.message || "خطأ في تسجيل الدخول");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome Back</h2>
      <p className="text-gray-200 mb-6 text-sm text-center">Login with your university email</p>
      
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Email (@must.edu.eg)"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-400 text-[10px] mt-1 text-left">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-400 text-[10px] mt-1 text-left">{formik.errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition disabled:bg-gray-500"
        >
          {loading ? "جاري المعالجة..." : "Login"}
        </button>
      </form>

      {registerAllowed !== false && (
        <p className="text-gray-300 text-sm mt-6 text-center">
          Don't have an account?{" "}
          <span className="text-green-400 cursor-pointer hover:underline font-bold" onClick={switchToRegister}>
            Register
          </span>
        </p>
      )}
    </div>
  );
}