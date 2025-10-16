
"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";

export default function RequestMentorshipForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.skills) {
      return Swal.fire({
        icon: "warning",
        title: "All fields are required!",
      });
    }

    try {
      setLoading(true);
      console.log(formData, "form data");

      
      const res = await api.post("/session-requests", {
        menteeEmail: user?.email,
        ...formData,
      });

      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text:
          res.data?.message ||
          "Your session request was sent successfully.",
      });

      setFormData({ title: "", description: "", skills: "" });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed to send request",
        text: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-8 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Request a Mentorship Session
      </h2>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder='e.g., "Help with React useEffect"'
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Explain what you need help with..."
          rows="4"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        ></textarea>
      </div>

      <div className="mb-5">
        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
          Relevant Skills / Topics
        </label>
        <input
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="e.g., React, JavaScript, API Integration"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
