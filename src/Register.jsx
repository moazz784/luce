import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  registerStart,
  registerVerify,
  isStudentMustEmail,
} from "./authService";

import { api } from "./Api";

export default function Register() {
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

  // validation
  const validationSchema = useMemo(() => {
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
  }, [registerStep]);

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
        // STEP 1 -> send code
        if (registerStep === 1) {
          await registerStart(
            values.name,
            values.email,
            values.password
          );

          setRegisterStep(2);
          formik.setFieldValue("otp", "");

          toast.info("تم إرسال كود التحقق لبريدك الإلكتروني");
          return;
        }

        // STEP 2 -> verify
        await registerVerify(
          values.email,
          values.otp,
          values.password
        );

        toast.success("تم إنشاء الحساب بنجاح!");
        formik.resetForm();
        setRegisterStep(1);

        // اختياري: تحويل للوجين بعد التسجيل
        navigate("/login", { replace: true });
      } catch (err) {
        const msg = err.message || "حدث خطأ ما";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const showStep1 = registerStep === 1;
  const showStep2 = registerStep === 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2138] via-[#0f2a44] to-[#152f4a] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[#0f2a44]/80"></div>

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[380px] text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2">
          Create Account
        </h2>

        <p className="text-gray-200 mb-6 text-sm">
          Join LeafScan with your student ID email
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {showStep1 && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-400 text-[10px] text-left">
                  {formik.errors.name}
                </p>
              )}

              <input
                type="email"
                placeholder="Email (@must.edu.eg)"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-[10px] text-left">
                  {formik.errors.email}
                </p>
              )}

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-[10px] text-left">
                  {formik.errors.password}
                </p>
              )}

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("confirmPassword")}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-400 text-[10px] text-left">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </>
          )}

          {showStep2 && (
            <>
              <input
                type="text"
                placeholder="6-digit code"
                maxLength="6"
                className="w-full p-3 rounded-lg bg-white/20 text-white text-center tracking-widest"
                {...formik.getFieldProps("otp")}
              />
              {formik.touched.otp && formik.errors.otp && (
                <p className="text-red-400 text-[10px] text-left">
                  {formik.errors.otp}
                </p>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold"
          >
            {loading
              ? "جاري المعالجة..."
              : showStep1
              ? "Get Code"
              : "Verify & Register"}
          </button>
        </form>
      </div>
    </div>
  );
}