"use client";
import React, { useState } from "react";
import { 
  Briefcase, 
  Clock, 
  Heart, 
  Sparkles, 
  CheckCircle,
  Users
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../utils/api";

export default function BecomeMentor() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    expertise: "",
    experience: "",
    availability: "",
    motivation: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.expertise.trim() ||
      !form.experience.trim() ||
      !form.availability.trim() ||
      !form.motivation.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "All fields are required!",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/apply-mentor", form, { withCredentials: true });

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: res.data.message || "Your mentor request has been sent for review.",
        confirmButtonColor: "#2563eb",
      });

      // Clear form
      setForm({
        expertise: "",
        experience: "",
        availability: "",
        motivation: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full mb-4 shadow-lg">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Become a Mentor
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-lg mx-auto px-4">
            Share your knowledge and inspire the next generation of developers. Join our community of expert mentors.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expertise Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <Sparkles className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                Expertise
              </label>
              <input
                name="expertise"
                placeholder="e.g. MERN Stack, Django, DevOps, Machine Learning"
                value={form.expertise}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Experience Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <Briefcase className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                Experience
              </label>
              <input
                name="experience"
                placeholder="e.g. 3 years in full-stack development"
                value={form.experience}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Availability Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <Clock className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                Availability
              </label>
              <input
                name="availability"
                placeholder="e.g. Weekends, Evenings (6-9 PM)"
                value={form.availability}
                onChange={handleChange}
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Motivation Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                <Heart className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                Motivation
              </label>
              <textarea
                name="motivation"
                placeholder="Tell us why you want to become a mentor and what you hope to achieve..."
                value={form.motivation}
                onChange={handleChange}
                rows="5"
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 sm:py-4 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 ${
                loading
                  ? "bg-blue-400 dark:bg-blue-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>

          {/* Info Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
              By submitting this application, you agree to our mentorship guidelines and code of conduct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}