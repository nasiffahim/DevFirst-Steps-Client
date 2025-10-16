"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import useAuth from "../../hooks/useAuth";
import { UserCheck, XCircle, Clock, ArrowRight } from "lucide-react";

const ManageProjectsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
        Loading projects...
      </div>
    );

  if (projects.length === 0)
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
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyles[req.status]}`}
                      >
                        {statusIcons[req.status]}
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
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

            {/* View Details Button */}
            <button
              onClick={() =>
                router.push(`/Collaboration/manage-projects/${project._id}`)
              }
              className="mt-4 flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow-md transition-all transform hover:scale-105"
            >
              View Details <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjectsPage;
