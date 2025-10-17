"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import useAuth from "../../hooks/useAuth";
import { UserCheck, XCircle, Clock, ArrowRight, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const ManageProjectsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState({}); // track loading per project

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.email) return;
      try {
        const res = await api.get("/collaboration/manage-projects", {
          params: { ownerEmail: user.email },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      }
    };
    fetchProjects();
  }, [user]);

  const handleDeleteProject = async (project) => {
    const result = await Swal.fire({
      title: `Delete "${project.title}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        setLoadingProjects((prev) => ({ ...prev, [project._id]: true }));
        await api.delete(`/collaboration/delete-project/${project._id}`);
        Swal.fire("Deleted!", "Project has been deleted.", "success");
        setProjects((prev) =>
          prev.filter((p) => p._id !== project._id)
        );
      } catch (err) {
        console.error("Failed to delete project:", err);
        Swal.fire("Error", "Failed to delete project. Try again.", "error");
      } finally {
        setLoadingProjects((prev) => ({ ...prev, [project._id]: false }));
      }
    }
  };

  if (!projects.length)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-700 dark:text-gray-400">
        <p className="text-lg mb-4">No projects owned yet.</p>
      </div>
    );

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: <Clock size={16} className="inline mr-1" />,
    accepted: <UserCheck size={16} className="inline mr-1" />,
    rejected: <XCircle size={16} className="inline mr-1" />,
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">
        Manage My Projects
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {project.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {project.description || "No description provided."}
              </p>

              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Join Requests
              </h3>

              {project.joinRequests.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  No requests yet.
                </p>
              ) : (
                project.joinRequests.slice(0, 3).map((req) => (
                  <div
                    key={req._id}
                    className="flex items-center justify-between border border-gray-200 dark:border-gray-700 p-2 rounded mb-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {req.name} ({req.role})
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          statusStyles[req.status]
                        }`}
                      >
                        {statusIcons[req.status]}
                        {req.status.charAt(0).toUpperCase() +
                          req.status.slice(1)}
                      </span>
                      {req.status === "rejected" && req.reason && (
                        <p className="text-red-500 text-sm mt-1">
                          Reason: {req.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {project.joinRequests.length > 3 && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  ...and {project.joinRequests.length - 3} more requests
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() =>
                  router.push(`/collaboration/manage-projects/${project._id}`)
                }
                className="flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-md transition-all transform hover:scale-105"
              >
                View Details <ArrowRight size={18} />
              </button>
              <button
                onClick={() => handleDeleteProject(project)}
                disabled={loadingProjects[project._id]}
                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-full font-medium shadow-md transition-all transform ${
                  loadingProjects[project._id]
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
              >
                <Trash2 size={18} />{" "}
                {loadingProjects[project._id] ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjectsPage;
