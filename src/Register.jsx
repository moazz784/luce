import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { registerStart, registerVerify, isStudentMustEmail } from "./authService";

export default function Register({ switchToLogin }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: step === 1 ? Yup.string().required("الاسم مطلوب") : Yup.string(),
    email: Yup.string()
      .email("بريد إلكتروني غير صحيح")
      .required("البريد الإلكتروني مطلوب")
      .test("student", "استخدم رقم الطالب فقط: أرقام@must.edu.eg", (v) => !!v && isStudentMustEmail(v)),
    password: Yup.string().min(6, "كلمة المرور 6 أحرف على الأقل").required("كلمة المرور مطلوبة"),
    confirmPassword: step === 1 ? Yup.string().oneOf([Yup.ref("password")], "كلمات المرور غير متطابقة").required("تأكيد كلمة المرور مطلوب") : Yup.string(),
    otp: step === 2 ? Yup.string().matches(/^\d{6}$/, "أدخل 6 أرقام").required("رمز التحقق مطلوب") : Yup.string(),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "", otp: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (step === 1) {
          await registerStart(values.name, values.email, values.password);
          setStep(2);
          toast.info("تم إرسال كود التحقق لبريدك");
        } else {
          await registerVerify(values.email, values.otp, values.password);
          toast.success("تم إنشاء الحساب بنجاح!");
          switchToLogin();
        }
      } catch (err) {
        toast.error(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-white mb-2 text-center">{step === 1 ? "Create Account" : "Verify Email"}</h2>
      <p className="text-gray-200 mb-6 text-sm text-center">
        {step === 1 ? "Join LeafScan with student email" : `Enter code sent to: ${formik.values.email}`}
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <input type="text" placeholder="Full Name" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("name")} />
            <input type="email" placeholder="Email (@must.edu.eg)" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("email")} />
            <input type="password" placeholder="Password" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("password")} />
            <input type="password" placeholder="Confirm Password" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("confirmPassword")} />
          </>
        )}

        {step === 2 && (
          <input type="text" placeholder="6-digit code" maxLength="6" className="w-full p-3 rounded-lg bg-white/20 text-white text-center tracking-widest outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("otp")} />
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition">
          {loading ? "جاري المعالجة..." : step === 1 ? "Get Code" : "Verify & Register"}
        </button>
      </form>

      <p className="text-gray-300 text-sm mt-6 text-center">
        Already have an account?{" "}
        <span className="text-green-400 cursor-pointer hover:underline font-bold" onClick={switchToLogin}>
          Login
        </span>
      </p>
    </div>
  );
}