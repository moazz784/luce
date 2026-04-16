import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // استيراد التوست
import {
  login,
  registerStart,
  registerVerify,
  isMustLoginEmail,
  isStudentMustEmail,
} from "./authService";
import { api } from "./Api";
export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerAllowed, setRegisterAllowed] = useState(null);
  const navigate = useNavigate();

  // التحقق من حالة التسجيل (مسموح أم لا)
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

  // منطق التحقق (Validation) باستخدام Yup
  const validationSchema = useMemo(() => {
    if (isLogin) {
      return Yup.object({
        email: Yup.string()
          .required("اسم المستخدم أو البريد مطلوب")
          .test(
            "login",
            "استخدم اسم المستخدم أو بريد MUST (@must.edu.eg)",
            (v) => {
              if (!v || !v.trim()) return false;
              const t = v.trim();
              if (t.includes("@")) return isMustLoginEmail(t);
              return t.length >= 2 && t.length <= 256;
            },
          ),
        password: Yup.string().required("كلمة المرور مطلوبة"),
      });
    }
    if (registerStep === 2) {
      return Yup.object({
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
        .test("student", "استخدم رقم الطالب فقط: أرقام@must.edu.eg", (v) => !!v && isStudentMustEmail(v)),
      password: Yup.string()
        .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
        .required("كلمة المرور مطلوبة"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "كلمات المرور غير متطابقة")
        .required("تأكيد كلمة المرور مطلوب"),
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
          // تسجيل الدخول
          await login(values.email.trim(), values.password);
          toast.success("Logged in successfully");
          navigate("/", { replace: true });
          return;
        }

        if (registerStep === 1) {
          // بداية التسجيل (إرسال الكود)
          await registerStart(values.name, values.email, values.password);
          setRegisterStep(2);
          formik.setFieldValue("otp", "");
          toast.info("تم إرسال كود التحقق لبريدك الإلكتروني");
          return;
        }

        // تأكيد الكود وإتمام التسجيل
        await registerVerify(values.email, values.otp, values.password);
        toast.success("تم إنشاء الحساب بنجاح! يمكنك الدخول الآن");
        formik.resetForm();
        setRegisterStep(1);
        setIsLogin(true);
      } catch (err) {
        const errorMsg = err.message || "حدث خطأ ما";
        setError(errorMsg);
        toast.error(errorMsg); // إظهار الخطأ في توست
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

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[380px] text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : showOtpStep ? "Verify Email" : "Create Account"}
        </h2>

        <p className="text-gray-200 mb-6 text-sm">
          {isLogin
            ? "Sign in with your MUST username, or your full @must.edu.eg email"
            : showOtpStep
            ? `Enter code sent to: ${formik.values.email}`
            : "Join LeafScan with your student ID email"}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {showRegisterForm && (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-400 text-[10px] mt-1 text-left">{formik.errors.name}</p>
              )}
            </div>
          )}

          {!showOtpStep && (
            <div>
              <input
                type={isLogin ? "text" : "email"}
                placeholder={
                  isLogin
                    ? "Username or email (@must.edu.eg)"
                    : "Email (@must.edu.eg)"
                }
                autoComplete={isLogin ? "username" : "email"}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-[10px] mt-1 text-left">{formik.errors.email}</p>
              )}
            </div>
          )}

          {showOtpStep && (
            <div>
              <input
                type="text"
                placeholder="6-digit code"
                maxLength="6"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400 text-center tracking-widest"
                {...formik.getFieldProps("otp")}
              />
              {formik.touched.otp && formik.errors.otp && (
                <p className="text-red-400 text-[10px] mt-1 text-left">{formik.errors.otp}</p>
              )}
            </div>
          )}

          {(isLogin || showOtpStep || showRegisterForm) && (
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
          )}

          {showRegisterForm && (
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-400 text-[10px] mt-1 text-left">{formik.errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition disabled:bg-gray-500"
          >
            {loading ? "جاري المعالجة..." : isLogin ? "Login" : showOtpStep ? "Verify & Register" : "Get Code"}
          </button>

          {showOtpStep && (
            <button
              type="button"
              className="text-xs text-gray-300 hover:text-white underline mt-2"
              onClick={() => setRegisterStep(1)}
            >
              Back to edit details
            </button>
          )}
        </form>

        {/* <p className="text-gray-300 text-sm mt-6">
          {registerAllowed !== false ? (
            <>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-green-400 cursor-pointer hover:underline font-bold"
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
            <span className="text-gray-400 italic text-xs">Registration is currently disabled</span>
          )}
        </p> */}
      </div>
    </div>
  );
}