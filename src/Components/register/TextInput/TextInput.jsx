"use client";
import React from "react";

export default function TextInput({ label, placeholder, icon: Icon, register, error }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          {...register}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none ${
            error ? "border-red-300" : "border-gray-300"
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
