"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { Calendar, Link2, MessageSquare, User, Mail } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";

export default function ScheduleSessionForm() {
  const { user } = useAuth();
  const [menteeName, setMenteeName] = useState("");
  const [menteeEmail, setMenteeEmail] = useState("");
  const [sessionLink, setSessionLink] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !menteeName.trim() ||
      !menteeEmail.trim() ||
      !sessionLink.trim() ||
      !comment.trim()
    ) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(menteeEmail)) {
      return Swal.fire("Error", "Please enter a valid email address", "error");
    }

    setLoading(true);
    try {
      const payload = {
        menteeName: menteeName.trim(),
        menteeEmail: menteeEmail.trim(),
        sessionLink: sessionLink.trim(),
        comment: comment.trim(),
        mentorEmail: user?.email,
        createdAt: new Date(),
      };

      console.log("Sending data:", payload);

      const res = await api.post("/schedule-session", payload);

      Swal.fire("Success", "Session scheduled successfully!", "success");
      setMenteeName("");
      setMenteeEmail("");
      setSessionLink("");
      setComment("");
    } catch (err) {
      console.error("Error scheduling session:", err);
      Swal.fire("Error", "Failed to schedule session", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-6 sm:p-8">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white dark:bg-gray-900 p-3 rounded-full">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Schedule a Session
              </h2>
            </div>
            <p className="text-center text-blue-100 dark:text-blue-200 mt-3 text-sm sm:text-base">
              Set up a mentoring session with your mentee
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                Mentee Name
              </label>
              <input
                type="text"
                placeholder="Enter mentee's full name"
                value={menteeName}
                onChange={(e) => setMenteeName(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                Mentee Email
              </label>
              <input
                type="email"
                placeholder="mentee@example.com"
                value={menteeEmail}
                onChange={(e) => setMenteeEmail(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <Link2 className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                Session Link
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/xyz or https://zoom.us/j/123"
                value={sessionLink}
                onChange={(e) => setSessionLink(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                Session Notes
              </label>
              <textarea
                placeholder="Add session details, agenda, or instructions for the mentee..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                required
              ></textarea>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white py-3.5 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scheduling...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Session</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-4 sm:p-5">
          <p className="text-sm text-blue-800 dark:text-blue-300 text-center">
            <span className="font-semibold">💡 Tip:</span> Make sure to include
            the meeting date and time in your session notes!
          </p>
        </div>
      </div>
    </div>
  );
}
