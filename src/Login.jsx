import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const validationSchema = Yup.object({
    name: isLogin
      ? Yup.string()
      : Yup.string().required("Name is required"),

    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),

    confirmPassword: isLogin
      ? Yup.string()
      : Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(isLogin ? "Login" : "Register", values);
    },
    enableReinitialize: true,
  });

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1')] bg-cover bg-center flex items-center justify-center">
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0f2a44]/80"></div>

      {/* Card */}
      <div className="relative bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-[350px] text-center border border-white/20">
        
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>

        <p className="text-gray-200 mb-6">
          {isLogin ? "Login to your account" : "Sign up to get started"}
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-400 text-sm">{formik.errors.name}</p>
              )}
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-400 text-sm">{formik.errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-400 text-sm">{formik.errors.password}</p>
          )}

          {!isLogin && (
            <>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-green-400"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-400 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-300 text-sm mt-4">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <span
            className="text-green-400 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
