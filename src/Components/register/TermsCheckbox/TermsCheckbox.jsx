"use client";
import React from "react";

export default function TermsCheckbox({ register, error }) {
  return (
    <div>
      <div className="flex items-start">
        <input
          type="checkbox"
          {...register("terms", { required: "You must accept the terms" })}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded"
        />
        <label className="ml-3 text-sm text-gray-600">
          I agree to the{" "}
          <a href="#" className="text-blue-600 font-medium">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 font-medium">
            Privacy Policy
          </a>
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
