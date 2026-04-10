import { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { registerStart, registerVerify, isStudentMustEmail } from "./authService";

export default function Register({ toggleAuth, onRegisterSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const validationSchema = useMemo(() => {
    if (step === 2) {
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
      password: Yup.string().min(6, "6 أحرف على الأقل").required("كلمة المرور مطلوبة"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "كلمات المرور غير متطابقة")
        .required("تأكيد كلمة المرور مطلوب"),
    });
  }, [step]);

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
          onRegisterSuccess(); // وظيفة ترجع المستخدم للـ Login
        }
      } catch (err) {
        toast.error(err.message || "حدث خطأ ما");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[380px] text-center border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-2">{step === 1 ? "Create Account" : "Verify Email"}</h2>
      <p className="text-gray-200 mb-6 text-sm">
        {step === 1 ? "Join LeafScan with your student ID" : `Code sent to: ${formik.values.email}`}
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {step === 1 ? (
          <>
            <input type="text" placeholder="Full Name" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("name")} />
            <input type="email" placeholder="Email (@must.edu.eg)" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("email")} />
            <input type="password" placeholder="Password" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("password")} />
            <input type="password" placeholder="Confirm Password" className="w-full p-3 rounded-lg bg-white/20 text-white outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("confirmPassword")} />
          </>
        ) : (
          <>
            <input type="text" placeholder="6-digit code" maxLength="6" className="w-full p-3 rounded-lg bg-white/20 text-white text-center tracking-widest outline-none focus:ring-2 focus:ring-green-400" {...formik.getFieldProps("otp")} />
            <button type="button" className="text-xs text-gray-300 underline" onClick={() => setStep(1)}>Edit Details</button>
          </>
        )}

        <button type="submit" disabled={loading} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition">
          {loading ? "جاري المعالجة..." : step === 1 ? "Get Code" : "Verify & Register"}
        </button>
      </form>

      <p className="text-gray-300 text-sm mt-6">
        Already have an account? <span className="text-green-400 cursor-pointer hover:underline font-bold" onClick={toggleAuth}>Login</span>
      </p>
    </div>
  );
}