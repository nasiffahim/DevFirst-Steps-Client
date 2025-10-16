"use client";
import React, { useState, useEffect, useCallback } from "react";
import api from "../../../utils/api";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const SessionPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/my-schedule-session");
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



  if (loading) return <p className="text-center mt-10">Loading sessions...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-6">
        My Scheduled Sessions
      </h2>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-500">
          No sessions scheduled yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {sessions.map((s, idx) => (
            <div
              key={idx}
              className="p-5 border rounded-2xl shadow-md bg-white dark:bg-gray-900 hover:shadow-lg transition-all"
            >
              <h3 className="font-semibold text-lg text-blue-600">
                Session {idx + 1}
              </h3>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                <span className="font-medium">Mentor:</span> {s.mentorEmail}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Mentee:</span> {s.menteeEmail}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">Comment:</span> {s.comment}
              </p>
              {/* Actions button  */}
             <div className="flex justify-between mt-2">
                {/* Delete Button  */}
                <button
                      onClick={() => handleDelete(s._id)}
                      className=" flex items-center justify-center gap-2 cursor-pointer px-2 py-2 rounded-lg bg-red-600 dark:bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-red-700 dark:hover:bg-red-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    {/* Join Button  */}
                 <a
                href={s.sessionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 hover:shadow-md hover:scale-105 transition-all duration-200"
              >
                Join Session
              </a>
             </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionPage;
