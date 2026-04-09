import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  login,
  registerStart,
  registerVerify,
  isMustLoginEmail,
  isStudentMustEmail,
} from "./authService";
import { api } from "./Api";
import { hasAdminRole } from "./jwtUtils";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
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
        if (!cancelled) setRegisterAllowed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (registerAllowed === false && !isLogin) setIsLogin(true);
  }, [registerAllowed, isLogin]);

  const validationSchema = useMemo(() => {
    if (isLogin) {
      return Yup.object({
        name: Yup.string(),
        email: Yup.string()
          .email("بريد إلكتروني غير صحيح")
          .required("البريد الإلكتروني مطلوب")
          .test(
            "must",
            "يجب استخدام بريد MUST (@must.edu.eg)",
            (v) => !!v && isMustLoginEmail(v),
          ),
        password: Yup.string()
          .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
          .required("كلمة المرور مطلوبة"),
        confirmPassword: Yup.string(),
        otp: Yup.string(),
      });
    }
    if (registerStep === 2) {
      return Yup.object({
        name: Yup.string(),
        email: Yup.string().email().required(),
        password: Yup.string()
          .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
          .required("كلمة المرور مطلوبة"),
        confirmPassword: Yup.string(),
        otp: Yup.string()
          .matches(/^\d{6}$/, "أدخل الرمز المكوّن من 6 أرقام")
          .required("رمز التحقق مطلوب"),
      });
    }
    return Yup.object({
      name: Yup.string().required("الاسم مطلوب"),
      email: Yup.string()
        .email("بريد إلكتروني غير صحيح")
        .required("البريد الإلكتروني مطلوب")
        .test(
          "student",
          "استخدم رقم الطالب فقط: أرقام@must.edu.eg",
          (v) => !!v && isStudentMustEmail(v),
        ),
      password: Yup.string()
        .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        .required("كلمة المرور مطلوبة"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "كلمات المرور غير متطابقة")
        .required("تأكيد كلمة المرور مطلوب"),
      otp: Yup.string(),
    });
  }, [isLogin, registerStep]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        if (isLogin) {
          await login(values.email, values.password);
          navigate(hasAdminRole() ? "/AdminDashboard" : "/", { replace: true });
          return;
        }
        if (registerStep === 1) {
          await registerStart(values.name, values.email, values.password);
          setRegisterStep(2);
          formik.setFieldValue("otp", "");
          setError("");
          return;
        }
        await registerVerify(values.email, values.otp, values.password);
        formik.resetForm();
        setRegisterStep(1);
        alert("تم إنشاء الحساب بنجاح");
        navigate("/", { replace: true });
      } catch (err) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    },
  });

  const showRegisterForm = !isLogin && registerStep === 1;
  const showOtpStep = !isLogin && registerStep === 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2138] via-[#0f2a44] to-[#152f4a] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[#0f2a44]/80"></div>

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[350px] text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : showOtpStep ? "Verify email" : "Create Account"}
        </h2>

        <p className="text-gray-200 mb-6">
          {isLogin
            ? "Login to your account"
            : showOtpStep
              ? "Enter the 6-digit code sent to your email"
              : "Sign up with your student ID email (@must.edu.eg)"}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {showRegisterForm && (
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

          {!showOtpStep && (
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email (@must.edu.eg)"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                {...formik.getFieldProps("email")}
                disabled={isLogin ? false : false}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-xs mt-1 text-left">{formik.errors.email}</p>
              )}
            </div>
          )}

          {showOtpStep && (
            <>
              <p className="text-gray-300 text-xs text-left break-all">{formik.values.email}</p>
              <div>
                <input
                  type="text"
                  name="otp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                  {...formik.getFieldProps("otp")}
                />
                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-red-400 text-xs mt-1 text-left">{formik.errors.otp}</p>
                )}
              </div>
            </>
          )}

          {(isLogin || showOtpStep || showRegisterForm) && (
            <div>
              <input
                type="password"
                name="password"
                placeholder={showOtpStep ? "Password (same as before)" : "Password"}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-xs mt-1 text-left">{formik.errors.password}</p>
              )}
            </div>
          )}

          {showRegisterForm && (
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
            {loading
              ? "جاري التحميل..."
              : isLogin
                ? "Login"
                : showOtpStep
                  ? "Complete registration"
                  : "Send verification code"}
          </button>

          {showOtpStep && (
            <button
              type="button"
              className="text-sm text-gray-300 hover:text-white underline"
              onClick={() => {
                setRegisterStep(1);
                setError("");
              }}
            >
              Back to edit details
            </button>
          )}
        </form>

        <p className="text-gray-300 text-sm mt-4 min-h-[1.25rem]">
          {registerAllowed !== false ? (
            <>
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <span
                className="text-green-400 cursor-pointer hover:underline font-medium"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setRegisterStep(1);
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
