"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "../../../utils/api";
import {
  Trash2,
  Calendar,
  Users,
  MessageSquare,
  ExternalLink,
  Clock,
} from "lucide-react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const SessionPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/my-schedule-session", {
          params: {
            email: user?.email,
          },
        });
        setSessions(res.data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleDelete = useCallback((id) => {
    if (!id) return;

    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/my-schedule-session/${id}`);
          setSessions((prev) => prev.filter((p) => p._id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your Session has been removed.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Something went wrong. Try again.",
          });
        }
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Loading sessions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              My Scheduled Sessions
            </h1>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Manage and join your upcoming mentoring sessions
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-800">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Sessions Scheduled
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              You don't have any scheduled sessions yet.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Mentor
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Mentee
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Comment
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {sessions.map((s, idx) => (
                    <tr
                      key={s._id || idx}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {s.mentorEmail}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {s.menteeEmail}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                          {s.comment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={s.sessionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Join
                          </a>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 dark:bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-800">
              {sessions.map((s, idx) => (
                <div
                  key={s._id || idx}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
                      {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                          Mentor
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                          {s.mentorEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                          Mentee
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                          {s.menteeEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                          Comment
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                          {s.comment}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <a
                      href={s.sessionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Join Session
                    </a>
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 dark:bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPage;
