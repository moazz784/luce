import { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  const [registerAllowed, setRegisterAllowed] = useState(null);

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

    onSubmit: async (values) => {
      setLoading(true);

      try {
        // STEP 1: send code
        if (registerStep === 1) {
          await registerStart(values.name, values.email, values.password);
          setRegisterStep(2);
          formik.setFieldValue("otp", "");
          toast.info("تم إرسال كود التحقق على الإيميل");
          return;
        }

        // STEP 2: verify
        await registerVerify(values.email, values.otp, values.password);

        toast.success("تم إنشاء الحساب بنجاح 🎉");

        setRegisterStep(1);
        formik.resetForm();
      } catch (err) {
        toast.error(err.message || "حدث خطأ ما");
      } finally {
        setLoading(false);
      }
    },
  });

  if (registerAllowed === false) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Registration is disabled
      </div>
    );
  }

  const isOtpStep = registerStep === 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2138] via-[#0f2a44] to-[#152f4a] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[#0f2a44]/80"></div>

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[380px] text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-4">
          {isOtpStep ? "Verify Email" : "Create Account"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">

          {/* STEP 1 */}
          {!isOtpStep && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("name")}
              />

              <input
                type="email"
                placeholder="Email (@must.edu.eg)"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("email")}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("password")}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-white/20 text-white"
                {...formik.getFieldProps("confirmPassword")}
              />
            </>
          )}

          {/* STEP 2 OTP */}
          {isOtpStep && (
            <input
              type="text"
              placeholder="6-digit code"
              maxLength="6"
              className="w-full p-3 rounded-lg bg-white/20 text-white text-center tracking-widest"
              {...formik.getFieldProps("otp")}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 py-3 text-white rounded-lg font-bold"
          >
            {loading
              ? "جاري المعالجة..."
              : isOtpStep
              ? "Verify & Register"
              : "Get Code"}
          </button>
        </form>
      </div>
    </div>
  );
}