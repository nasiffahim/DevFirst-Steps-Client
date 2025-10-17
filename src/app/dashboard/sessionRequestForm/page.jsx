"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";
import { 
  Send, 
  Loader2, 
  FileText, 
  MessageSquare, 
  Tags,
  Sparkles,
  ArrowLeft,
  User,
  Mail
} from "lucide-react";
import Link from "next/link";

export default function RequestMentorshipForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    mentorName: "",
    mentorEmail: "",
  });
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.skills || !formData.mentorName || !formData.mentorEmail) {
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

      setFormData({ title: "", description: "", skills: "", mentorName: "", mentorEmail: "" });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard/find-mentor"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Mentors</span>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-2xl shadow-lg mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Request a Mentorship Session
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            Share your learning goals and connect with an experienced mentor who can guide you
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 sm:p-8 lg:p-10">
            {/* Mentor Name Field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3 text-lg">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Mentor Name
              </label>
              <input
                type="text"
                name="mentorName"
                value={formData.mentorName}
                onChange={handleChange}
                placeholder="Enter mentor's full name"
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Mentor Email Field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3 text-lg">
                <Mail className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                Mentor Email
              </label>
              <input
                type="email"
                name="mentorEmail"
                value={formData.mentorEmail}
                onChange={handleChange}
                placeholder="mentor@example.com"
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>

            {/* Title Field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3 text-lg">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Session Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder='e.g., "Help with React useEffect"'
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-200"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>💡</span>
                Keep it clear and concise
              </p>
            </div>

            {/* Description Field */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3 text-lg">
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain what you need help with... Be specific about your current level and what you hope to learn."
                rows="5"
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent outline-none resize-none transition-all duration-200"
              ></textarea>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>📝</span>
                The more details you provide, the better the mentor can help
              </p>
            </div>

            {/* Skills Field */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3 text-lg">
                <Tags className="w-5 h-5 text-green-600 dark:text-green-400" />
                Relevant Skills / Topics
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, JavaScript, API Integration"
                className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent outline-none transition-all duration-200"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <span>🏷️</span>
                Separate multiple skills with commas
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Request
                </>
              )}
            </button>
          </div>          
        </form>
      </div>
    </div>
  );
}