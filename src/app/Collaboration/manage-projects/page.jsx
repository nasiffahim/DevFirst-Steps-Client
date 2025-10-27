"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import useAuth from "../../hooks/useAuth";
import { 
  UserCheck, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Trash2, 
  Briefcase,
  Users,
  AlertCircle,
  FolderOpen
} from "lucide-react";
import Swal from "sweetalert2";

const ManageProjectsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState({});

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
        setProjects((prev) => prev.filter((p) => p._id !== project._id));
      } catch (err) {
        console.error("Failed to delete project:", err);
        Swal.fire("Error", "Failed to delete project. Try again.", "error");
      } finally {
        setLoadingProjects((prev) => ({ ...prev, [project._id]: false }));
      }
    }
  };

  const statusStyles = {
    pending: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    accepted: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    rejected: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
  };

  const statusIcons = {
    pending: <Clock size={14} className="inline" />,
    accepted: <UserCheck size={14} className="inline" />,
    rejected: <XCircle size={14} className="inline" />,
  };

  if (!projects.length)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 px-4">
        <div className="text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-12 shadow-lg max-w-md">
          <FolderOpen className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Projects Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't created any collaboration projects. Start by creating your first project!
          </p>
          <button
            onClick={() => router.push("/collaboration/new")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Create New Project
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                Manage My Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Review join requests and manage your collaboration projects
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {projects.length}
              </span>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {projects.length === 1 ? "Project" : "Projects"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Project Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1">
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg flex-shrink-0">
                    <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {project.joinRequests?.length || 0}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </div>

              {/* Join Requests Section */}
              <div className="p-6 flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Join Requests
                  </h3>
                </div>

                {project.joinRequests.length === 0 ? (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm py-3 bg-gray-50 dark:bg-gray-800 rounded-lg px-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>No requests yet</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {project.joinRequests.slice(0, 3).map((req) => (
                      <div
                        key={req._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {req.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {req.role}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${
                              statusStyles[req.status]
                            }`}
                          >
                            {statusIcons[req.status]}
                            <span className="capitalize">{req.status}</span>
                          </span>
                        </div>
                        {req.status === "rejected" && req.reason && (
                          <p className="text-red-600 dark:text-red-400 text-xs mt-2 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-200 dark:border-red-800">
                            <span className="font-semibold">Reason:</span> {req.reason}
                          </p>
                        )}
                      </div>
                    ))}
                    {project.joinRequests.length > 3 && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs text-center pt-2">
                        +{project.joinRequests.length - 3} more requests
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 flex flex-col gap-2">
                <button
                  onClick={() =>
                    router.push(`/Collaboration/manage-projects/${project._id}`)
                  }
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>View Details</span>
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => handleDeleteProject(project)}
                  disabled={loadingProjects[project._id]}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold shadow-md transition-all ${
                    loadingProjects[project._id]
                      ? "bg-red-400 dark:bg-red-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 transform hover:-translate-y-0.5"
                  } text-white`}
                >
                  <Trash2 size={18} />
                  <span>
                    {loadingProjects[project._id] ? "Deleting..." : "Delete Project"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageProjectsPage;