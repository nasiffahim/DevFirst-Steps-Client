"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, AlertCircle, User, Mail } from "lucide-react";
import ImageUpload from "../../Components/register/ImageUpload/ImageUpload";
import PasswordField from "../../Components/register/PasswordField/PasswordField";
import TextInput from "../../Components/register/TextInput/TextInput";
import TermsCheckbox from "../../Components/register/TermsCheckbox/TermsCheckbox";

const RegisterPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const payload = {
        ...data,
        profileImage: imageUrl,
      };

      // Example API (replace with your backend)
      await new Promise((res) => setTimeout(res, 2000));

      setSubmitStatus("success");
      reset();
      setImageUrl(null);
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join us and start your journey today</p>
        </div>

        {/* Status Messages */}
        {submitStatus === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">
              Account created successfully! 🎉
            </p>
          </div>
        )}
        {submitStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">
              Registration failed. Please try again.
            </p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-6"
        >
          {/* Profile Image Upload */}
          <ImageUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />

          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="First Name"
              placeholder="John"
              icon={User}
              register={register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              error={errors.firstName}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              icon={User}
              register={register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
              error={errors.lastName}
            />
          </div>

          {/* Email */}
          <TextInput
            label="Email"
            placeholder="john@example.com"
            icon={Mail}
            register={register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                message: "Invalid email address",
              },
            })}
            error={errors.email}
          />

          {/* Password & Confirm Password */}
          <PasswordField
            label="Password"
            register={register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
              validate: (val) =>
                (/[A-Z]/.test(val) &&
                  /[a-z]/.test(val) &&
                  /\d/.test(val)) ||
                "Must contain uppercase, lowercase, and number",
            })}
            error={errors.password}
            watchValue={password}
            showStrength
          />

          <PasswordField
            label="Confirm Password"
            register={register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === password || "Passwords do not match",
            })}
            error={errors.confirmPassword}
          />

          {/* Terms */}
          <TermsCheckbox register={register} error={errors.terms} />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]"
            }`}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
