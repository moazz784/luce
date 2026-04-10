import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, isMustLoginEmail } from "./authService";
import { hasAdminRole } from "./jwtUtils";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = useMemo(() => {
    return Yup.object({
      email: Yup.string()
        .email("بريد إلكتروني غير صحيح")
        .required("البريد الإلكتروني مطلوب")
        .test("must", "يجب استخدام بريد MUST (@must.edu.eg)", (v) => !!v && isMustLoginEmail(v)),
      password: Yup.string().required("كلمة المرور مطلوبة"),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await login(values.email, values.password);
        toast.success("مرحباً بك مجدداً!");
        navigate(hasAdminRole() ? "/AdminDashboard" : "/", { replace: true });
      } catch (err) {
        toast.error(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2138] via-[#0f2a44] to-[#152f4a] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[#0f2a44]/80"></div>

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[380px] text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-200 mb-6 text-sm">
          Login with your university email
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email (@must.edu.eg)"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300"
            {...formik.getFieldProps("email")}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 text-white"
            {...formik.getFieldProps("password")}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 py-3 rounded-lg text-white font-bold"
          >
            {loading ? "جاري المعالجة..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}