"use client";
import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  label,
  register,
  error,
  watchValue,
  showStrength = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ["", "Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-blue-500",
      "bg-green-500",
    ];

    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(watchValue);

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          {...register}
          placeholder="••••••••"
          className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none ${
            error ? "border-red-300" : "border-gray-300"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {/* Strength Meter */}
      {showStrength && watchValue && (
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Password strength</span>
            <span
              className={`font-medium ${
                passwordStrength.strength >= 4
                  ? "text-green-600"
                  : passwordStrength.strength >= 3
                  ? "text-blue-600"
                  : passwordStrength.strength >= 2
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {passwordStrength.label}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${passwordStrength.color}`}
              style={{
                width: `${(passwordStrength.strength / 5) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
