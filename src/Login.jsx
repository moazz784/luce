import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  login,
  registerStart,
  registerVerify,
  isMustLoginEmail,
  isStudentMustEmail,
} from "./authService";

import { api } from "./Api";
import { hasAdminRole } from "./jwtUtils";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [registerStep, setRegisterStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerAllowed, setRegisterAllowed] = useState(null);

  const navigate = useNavigate();

  // check registration status
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
    if (registerAllowed === false && !isLogin) {
      setIsLogin(true);
    }
  }, [registerAllowed, isLogin]);

  // validation
  const validationSchema = useMemo(() => {
    if (isLogin) {
      return Yup.object({
        email: Yup.string()
          .email("بريد إلكتروني غير صحيح")
          .required("البريد الإلكتروني مطلوب")
          .test(
            "must",
            "يجب استخدام بريد MUST (@must.edu.eg)",
            (v) => !!v && isMustLoginEmail(v)
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
        .test(
          "student",
          "استخدم رقم الطالب فقط: أرقام@must.edu.eg",
          (v) => !!v && isStudentMustEmail(v)
        ),
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
          await login(values.email, values.password);

          toast.success("مرحباً بك مجدداً! جاري الدخول...");
          navigate(hasAdminRole() ? "/AdminDashboard" : "/", {
            replace: true,
          });
          return;
        }

        if (registerStep === 1) {
          await registerStart(values.name, values.email, values.password);

          setRegisterStep(2);
          formik.setFieldValue("otp", "");

          toast.info("تم إرسال كود التحقق لبريدك الإلكتروني");
          return;
        }

        await registerVerify(values.email, values.otp, values.password);

        toast.success("تم إنشاء الحساب بنجاح! يمكنك الدخول الآن");

        formik.resetForm();
        setRegisterStep(1);
        setIsLogin(true);
      } catch (err) {
        const errorMsg = err.message || "حدث خطأ ما";
        setError(errorMsg);
        toast.error(errorMsg);
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
          {isLogin
            ? "Welcome Back"
            : showOtpStep
            ? "Verify Email"
            : "Create Account"}
        </h2>

        <p className="text-gray-200 mb-6 text-sm">
          {isLogin
            ? "Login with your university email"
            : showOtpStep
            ? `Enter code sent to: ${formik.values.email}`
            : "Join LeafScan with your student ID email"}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {showRegisterForm && (
            <input
              type="text"
              placeholder="Full Name"
              className="input"
              {...formik.getFieldProps("name")}
            />
          )}

          {!showOtpStep && (
            <input
              type="email"
              placeholder="Email"
              className="input"
              {...formik.getFieldProps("email")}
            />
          )}

          {showOtpStep && (
            <input
              type="text"
              placeholder="OTP"
              maxLength="6"
              className="input text-center tracking-widest"
              {...formik.getFieldProps("otp")}
            />
          )}

          {(isLogin || showOtpStep || showRegisterForm) && (
            <input
              type="password"
              placeholder="Password"
              className="input"
              {...formik.getFieldProps("password")}
            />
          )}

          {showRegisterForm && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="input"
              {...formik.getFieldProps("confirmPassword")}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-bold"
          >
            {loading
              ? "جاري المعالجة..."
              : isLogin
              ? "Login"
              : showOtpStep
              ? "Verify & Register"
              : "Get Code"}
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-6">
          {registerAllowed !== false ? (
            <>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-green-400 cursor-pointer"
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
            <span>Registration is disabled</span>
          )}
        </p>
      </div>
    </div>
  );
}