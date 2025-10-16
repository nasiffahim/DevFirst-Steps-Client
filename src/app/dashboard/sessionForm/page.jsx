"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import { Calendar } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";

export default function ScheduleSessionForm({
  mentorEmail,
  menteeEmail,
  requestId,
}) {
  const { user } = useAuth();
  const [sessionLink, setSessionLink] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sessionLink.trim() || !comment.trim()) {
      return Swal.fire("Error", "All fields are required", "error");
    }

    setLoading(true);
    try {
      const payload = {
        sessionLink: sessionLink.trim(),
        comment: comment.trim(),
        mentorEmail: user?.email,
        menteeEmail,
        requestId,
      };

      console.log("Sending data:", payload);

      const res = await api.post("/schedule-session", payload);

      Swal.fire("Success", "Session scheduled successfully!", "success");
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
    <div className="max-w-md mx-auto bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md mt-6">
      <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
        <Calendar /> <span>Schedule a Session</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Session Link</label>
          <input
            type="url"
            placeholder="Enter meeting link (e.g., Google Meet, Zoom)"
            value={sessionLink}
            onChange={(e) => setSessionLink(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Comment / Session Note
          </label>
          <textarea
            placeholder="Add a short note or instruction for the mentee..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200"
        >
          {loading ? "Scheduling..." : "Schedule Session"}
        </button>
      </form>
    </div>
  );
}
