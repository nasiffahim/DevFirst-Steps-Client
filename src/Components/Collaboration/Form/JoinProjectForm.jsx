"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Documentation / Community Manager",
];

export default function JoinProjectForm({ projectId, user, onClose }) {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) return toast.error("Please select a preferred role");

    setLoading(true);

    const joinRequestData = {
      projectId,
      name: user.name,
      email: user.email,
      role,
      message,
      photoURL: user.photoURL,
    };

    console.log(joinRequestData);

    setTimeout(() => {
      toast.success("Join request submitted!");
      setLoading(false);
      onClose?.();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal */}
      <div className="relative w-full max-w-md h-[80vh] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          ✕
        </button>

        {/* Scrollable Form */}
        <div className="overflow-auto p-6 flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Join This Project
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Preferred Role */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Preferred Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select your role</option>
                {roles.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Optional message to the team"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Join Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
