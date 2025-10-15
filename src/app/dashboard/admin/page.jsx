"use client";
import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function MentorApplications() {
  const [applications, setApplications] = useState([]);
  const axiosSecure = useAxiosSecure();

  const fetchData = async () => {
    
    try {
      const res = await axiosSecure.get("/admin/mentor-applications");
      setApplications(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to fetch mentor applications.",
      });
    }
  };

  const handleStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: `Are you sure you want to ${status} this application?`,
      text:
        status === "approved"
          ? "This mentor will be marked as approved."
          : "This application will be rejected.",
      icon: status === "approved" ? "success" : "warning",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${status} it!`,
    });

    if (confirm.isConfirmed) {
      try {
        await axiosSecure.patch(`/admin/mentor-applications/${id}`, { status });

        await Swal.fire({
          icon: "success",
          title:
            status === "approved"
              ? "Application Approved!"
              : "Application Rejected!",
          text:
            status === "approved"
              ? "The mentor has been successfully approved."
              : "The application has been rejected.",
          timer: 1800,
          showConfirmButton: false,
        });

        fetchData();
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
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Mentor Applications</h2>

      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No applications found.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p>
                <strong>Email:</strong> {app.email}
              </p>
              <p>
                <strong>Expertise:</strong> {app.expertise}
              </p>
              <p>
                <strong>Experience:</strong> {app.experience}
              </p>
              <p>
                <strong>Availability:</strong> {app.availability}
              </p>
              <p>
                <strong>Motivation:</strong> {app.motivation}
              </p>
              <p className="mt-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    app.status === "approved"
                      ? "text-green-600"
                      : app.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>

              <div className="mt-3 space-x-2">
                <button
                  onClick={() => handleStatus(app._id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition"
                  disabled={app.status === "approved"}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatus(app._id, "rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                  disabled={app.status === "rejected"}
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
