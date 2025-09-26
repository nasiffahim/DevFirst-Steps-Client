"use client";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import useAuth from "../../../app/hooks/useAuth";
import SocialLogin from "../../../Components/SocialLogin/SocialLogin";
import axios from "axios";
import Swal from 'sweetalert2';

const LoginPage = () => {
   const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
   const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const { userSign,} = useAuth(); // from AuthProvider
  const {
    register,
    handleSubmit,

    formState: { errors,  },
  } = useForm();


  const onSubmit = async (data) => {
  try {
    // 1. Firebase authentication (or your auth logic)
    const userCredential = await userSign(data.email, data.password);
    const user = userCredential.user;

    // 2. Prepare payload to send to backend
    const payload = {
      uid: user.uid,
      email: user.email,
      fullName: data.fullName,
      image: data.image || null,
      role: "user",
      work: null,
    };

    // 3. Send user info to backend
    const rep = await axios.post("http://localhost:5000/login", payload);

    // 4. Handle backend response
    if (rep.data.success) {
      setStatus("success");

      // Optional: show success message
      Swal.fire({
        icon: 'success',
        title: 'Login successful',
        showConfirmButton: false,
        timer: 1500
      });

      // Redirect after short delay
      setTimeout(() => {
        router.replace(redirectPath);
      }, 1500);

    } else {
      console.error("Backend error:", rep.data.error);
      setStatus("error");

      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: rep.data.error || 'Unexpected error occurred',
      });
    }

  } catch (error) {
    console.error("Login error:", error.message);
    setStatus("error");

    Swal.fire({
      icon: 'error',
      title: 'Login error',
      text: 'Invalid email or password',
    });
  }
};


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Please login to your account
        </p>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
            />
            <Mail className="absolute left-3 bottom-0.5 -translate-y-1/2 text-gray-400" />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-10"
            />
            <Lock className="absolute left-3 bottom-1 -translate-y-1/2 text-gray-400" />
            <span
              className="absolute right-3 bottom-1 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
        <button
    type="submit"
    disabled={status === "loading"}
    className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
      status === "loading"
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] transition-transform"
    }`}
  >
    {status === "loading" ? "Logging in..." : "Login"}
  </button>
  {/* Status messages */}
  {status === "loading" && (
    <p className="text-center text-blue-600 mt-2 text-sm">
      Logging you in...
    </p>
  )}
  {status === "error" && (
    <p className="text-center text-red-500 mt-2 text-sm">
      Login failed. Try again.
    </p>
  )}


        </form>

<Link href="/ResetPassword" >
 
  <span className="text-center cursor-pointer text-blue-600 hover:underline">   Click here to reset password  </span>
</Link>

        {/* Divider */}
        <div className="my-2 flex justify-center">
          
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />

        </div>

        {/* Social Login */}
       <SocialLogin />

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
