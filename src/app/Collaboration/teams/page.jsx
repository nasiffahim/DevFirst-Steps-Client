"use client";

import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Image from "next/image";
import api from "../../../utils/api";
import { X } from "lucide-react";

const Page = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState({
    joined: [],
    pending: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
console.log(teams)
  // 🔹 Fetch user's team data
  useEffect(() => {
    if (!user?.email) return;

    const fetchTeams = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/collaboration/my-teams?userEmail=${user.email}`
        );
        setTeams(res.data);
      } catch (err) {
        console.error("Failed to load team data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user?.email]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
        Loading your teams...
      </div>
    );

  // 🔹 Reusable Section
  const Section = ({ title, projects, emptyMsg }) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {projects.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">{emptyMsg}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj._id}
              onClick={() => setSelectedProject(proj)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {proj.title}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    proj.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      : proj.status === "rejected"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  }`}
                >
                  {proj.status || "Member"}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                {proj.description || "No description provided."}
              </p>

              <div className="flex -space-x-2">
                {proj.members?.slice(0, 5).map((m, idx) => (
                  <Image
                    key={idx}
                    src={m.avatar || "/default-avatar.png"}
                    alt={m.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                  />
                ))}
              </div>

              {proj.status === "rejected" && proj.reason && (
                <p className="mt-3 text-sm text-red-500">
                  Rejected: {proj.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        My Teams & Collaboration Requests
      </h1>

      <Section
        title="✅ Joined / Owned Projects"
        projects={teams.joined}
        emptyMsg="You haven't joined or created any projects yet."
      />
      <Section
        title="🕓 Pending Requests"
        projects={teams.pending}
        emptyMsg="You don't have any pending collaboration requests."
      />
      <Section
        title="❌ Rejected Projects"
        projects={teams.rejected}
        emptyMsg="No rejected requests so far."
      />

      {/* 🔹 Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedProject.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedProject.description || "No description available."}
            </p>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                Owner:
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                {selectedProject.owner?.name || "Unknown"} (
                {selectedProject.owner?.email})
              </p>
            </div>

            {selectedProject.skills?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Skills Needed:
                </h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedProject.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.members?.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Members:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg"
                    >
                      <Image
                        src={m.avatar || "/default-avatar.png"}
                        alt={m.name}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {m.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.status === "rejected" &&
              selectedProject.reason && (
                <p className="mt-3 text-sm text-red-500">
                  Rejection Reason: {selectedProject.reason}
                </p>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
