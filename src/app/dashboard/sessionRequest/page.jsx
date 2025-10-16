"use client";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../utils/api";

export default function SessionRequests() {
  const [requests, setRequests] = useState([]);

  // ✅ Fetch all session requests
  const fetchRequests = async () => {
    try {
      const res = await api.get("/session-requests");
      setRequests(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not fetch session requests.",
      });
    }
  };

  // ✅ Handle status change
  const handleStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${status} this session?`,
      text:
        status === "approved"
          ? "This session will be marked as approved."
          : "This session will be rejected.",
      icon: status === "approved" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${status} it!`,
    });

    if (confirm.isConfirmed) {
      try {
        await api.patch(`/session-requests/${id}`, { status });

        await Swal.fire({
          icon: "success",
          title:
            status === "approved" ? "Session Approved!" : "Session Rejected!",
          text:
            status === "approved"
              ? "The session has been successfully approved."
              : "The session has been rejected.",
          timer: 1800,
          showConfirmButton: false,
        });

        fetchRequests();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Action Failed!",
          text: "Something went wrong. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Session Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          No session requests found.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p>
                <strong>Title:</strong> {req.title}
              </p>
              <p>
                <strong>Description:</strong> {req.description}
              </p>
              <p>
                <strong>Skills/Topics:</strong> {req.skills}
              </p>
              <p>
                <strong>Requested By:</strong> {req.menteeEmail}
              </p>
              <p>
                <strong>createdAt:</strong> {req.createdAt}
              </p>
              <p className="mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    req.status === "approved"
                      ? "text-green-600"
                      : req.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {req.status}
                </span>
              </p>

              <div className="mt-3 space-x-2">
                <button
                  onClick={() => handleStatus(req._id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 cursor-pointer rounded transition"
                  disabled={req.status === "approved"}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatus(req._id, "rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 cursor-pointer rounded transition"
                  disabled={req.status === "rejected"}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
