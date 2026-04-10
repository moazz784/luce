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

  useEffect(() => {
    api("/api/auth/registration-status")
      .then((d) => setRegisterAllowed(!!d?.allowRegister))
      .catch(() => setRegisterAllowed(true));
  }, []);

  const validationSchema = useMemo(() => {
    if (registerStep === 2) {
      return Yup.object({
        otp: Yup.string()
          .matches(/^\d{6}$/, "أدخل 6 أرقام")
          .required(),
      });
    }

    return Yup.object({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required()
        .test("student", "email must", (v) => !!v && isStudentMustEmail(v)),
      password: Yup.string().min(6).required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")])
        .required(),
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
        if (registerStep === 1) {
          await registerStart(values.name, values.email, values.password);
          setRegisterStep(2);
          toast.info("تم إرسال الكود");
          return;
        }

        await registerVerify(values.email, values.otp, values.password);
        toast.success("تم التسجيل!");
        setRegisterStep(1);
        formik.resetForm();
      } catch (err) {
        toast.error(err.message || "Error");
      } finally {
        setLoading(false);
      }
    },
  });

  const showOtp = registerStep === 2;

  if (registerAllowed === false) {
    return <p className="text-center text-white">Registration disabled</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0c2138] via-[#0f2a44] to-[#152f4a] flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[#0f2a44]/80"></div>

      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[380px] text-center border border-white/20">
        <h2 className="text-2xl font-bold text-white mb-2">
          {showOtp ? "Verify Email" : "Create Account"}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {!showOtp && (
            <>
              <input
                placeholder="Full Name"
                className="w-full p-3 bg-white/20 text-white"
                {...formik.getFieldProps("name")}
              />

              <input
                placeholder="Email"
                className="w-full p-3 bg-white/20 text-white"
                {...formik.getFieldProps("email")}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-white/20 text-white"
                {...formik.getFieldProps("password")}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 bg-white/20 text-white"
                {...formik.getFieldProps("confirmPassword")}
              />
            </>
          )}

          {showOtp && (
            <input
              placeholder="6-digit code"
              className="w-full p-3 bg-white/20 text-white text-center"
              {...formik.getFieldProps("otp")}
            />
          )}

          <button className="w-full bg-green-500 py-3 text-white rounded-lg">
            {loading
              ? "Loading..."
              : showOtp
              ? "Verify & Register"
              : "Get Code"}
          </button>
        </form>
      </div>
    </div>
  );
}