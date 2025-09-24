"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, AlertCircle, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import TermsCheckbox from "../../../Components/register/TermsCheckbox/TermsCheckbox";
import ImageUpload from "../../../Components/register/ImageUpload/ImageUpload";
import SocialLogin from "../../../Components/SocialLogin/SocialLogin";
import axios from "axios";

const RegisterPage = () => {
  const [status, setStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

 const onSubmit = async (data) => {
  try {
    // 1. Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // 2. Update Firebase profile
    await updateProfile(userCredential.user, {
      displayName: data.fullName,
      photoURL: imageUrl || null,
    });

    // 3. Prepare payload for backend
   const payload = {
  uid: userCredential.user.uid,
  email: data.email,
  fullName: data.fullName,
  image: imageUrl,
  role: "user",
  work: null,
};


const rep = await axios.post("http://localhost:5000/user_create", payload);

    // 5. Handle backend response
    if (rep.data.success) {
      setStatus("success");
      router.push("/"); // Redirect to home
    } else {
      console.error("Backend error:", rep.data.error);
      setStatus("error");
    }

  } catch (error) {
    console.error("Registration error:", error.message);
    setStatus("error");
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        {/* Status */}
        {status === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Account created! 🎉</p>
          </div>
        )}
        {status === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Registration failed.</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-6"
        >
          {/* Profile Image */}
          <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />

          {/* Full Name */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full name is required" })}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register("email", { required: "Email is required" })}
              className="mt-1 w-full rounded-lg border px-10 py-2"
            />
            <Mail className="absolute left-3 top-[38px] w-5 h-5 text-gray-400" />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
                validate: (val) =>
                  (/[A-Z]/.test(val) &&
                    /[a-z]/.test(val) &&
                    /\d/.test(val) &&
                    /[^A-Za-z0-9]/.test(val)) ||
                  "Must include uppercase, lowercase, number & symbol",
              })}
              className="mt-1 w-full rounded-lg border px-3 py-2 pr-10"
            />
            <span
              className="absolute right-3 bottom-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (val) => val === password || "Passwords do not match",
              })}
              className="mt-1 w-full rounded-lg border px-3 py-2 pr-10"
            />
            <span
              className="absolute right-3 bottom-2 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </span>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <TermsCheckbox register={register} error={errors.terms} />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] transition-transform text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

{/* Divider */}
        <div className="my-2 flex justify-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Login */}
       <SocialLogin />
          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
