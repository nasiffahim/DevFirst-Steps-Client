"use client";

import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Image from "next/image";
import api from "../../../utils/api";
import { 
  X, 
  FolderOpen, 
  Clock, 
  Users, 
  Award,
  Briefcase,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserCheck
} from "lucide-react";

const Page = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState({
    joined: [],
    pending: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

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
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your teams...</p>
        </div>
      </div>
    );

  // Empty Card Component
  const EmptyCard = ({ icon: Icon, title, message }) => (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center bg-white dark:bg-gray-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-full mb-4">
        <Icon className="text-blue-600 dark:text-blue-400 w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md">
        {message}
      </p>
    </div>
  );

  // Section Component
  const Section = ({ title, projects, emptyMsg, icon, statusColor }) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-5">
        <div className={`p-2 ${statusColor} rounded-lg`}>
          {React.createElement(icon, { className: "w-5 h-5" })}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <span className="ml-auto px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
          {projects.length} {projects.length === 1 ? "Project" : "Projects"}
        </span>
      </div>
      
      {projects.length === 0 ? (
        <EmptyCard
          icon={icon}
          title="Nothing Here Yet"
          message={emptyMsg}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              onClick={() => setSelectedProject(proj)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all duration-300 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 flex-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {proj.title}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-1 flex-shrink-0 ${
                      proj.status === "pending"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                        : proj.status === "rejected"
                        ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                        : "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                    }`}
                  >
                    {proj.status === "pending" && <Clock className="w-3 h-3" />}
                    {proj.status === "rejected" && <XCircle className="w-3 h-3" />}
                    {!proj.status && <CheckCircle className="w-3 h-3" />}
                    <span>{proj.status || "Member"}</span>
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {proj.description || "No description provided."}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-5">
                {/* Members */}
                {proj.members?.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Team Members ({proj.members.length})
                      </span>
                    </div>
                    <div className="flex -space-x-2">
                      {proj.members.slice(0, 5).map((m, idx) => (
                        <div
                          key={idx}
                          className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-900 overflow-hidden bg-gray-200 dark:bg-gray-700"
                          title={m.name}
                        >
                          <Image
                            src={m.avatar || "/default-avatar.png"}
                            alt={m.name}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {proj.members.length > 5 && (
                        <div className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-900 bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                            +{proj.members.length - 5}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {proj.status === "rejected" && proj.reason && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                          Rejection Reason
                        </p>
                        <p className="text-xs text-red-700 dark:text-red-300">
                          {proj.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const totalProjects = teams.joined.length + teams.pending.length + teams.rejected.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                My Teams & Collaborations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your joined projects and track collaboration requests
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-3 flex-wrap">
              <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Joined</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">{teams.joined.length}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Pending</p>
                    <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">{teams.pending.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Section
          title="Active Projects"
          projects={teams.joined}
          emptyMsg="You haven't joined or created any projects yet. Explore collaborations and start contributing today!"
          icon={UserCheck}
          statusColor="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
        />
        <Section
          title="Pending Requests"
          projects={teams.pending}
          emptyMsg="You don't have any pending collaboration requests. When you request to join, they'll appear here."
          icon={Clock}
          statusColor="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
        />
        <Section
          title="Rejected Requests"
          projects={teams.rejected}
          emptyMsg="No rejected requests so far. Keep building and collaborating!"
          icon={XCircle}
          statusColor="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        />
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-5">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white pr-8 mb-1">
                {selectedProject.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${
                  selectedProject.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : selectedProject.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {selectedProject.status === "pending" && <Clock className="w-3 h-3" />}
                {selectedProject.status === "rejected" && <XCircle className="w-3 h-3" />}
                {!selectedProject.status && <CheckCircle className="w-3 h-3" />}
                {selectedProject.status || "Active Member"}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Description */}
              <div className="mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-2">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Project Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedProject.description || "No description available."}
                </p>
              </div>

              {/* Owner Info */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Project Owner
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedProject.owner?.name || "Unknown"}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      {selectedProject.owner?.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {selectedProject.skills?.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Members */}
              {selectedProject.members?.length > 0 && (
                <div className="mb-6">
                  <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-3">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Team Members ({selectedProject.members.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedProject.members.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                          <Image
                            src={m.avatar || "/default-avatar.png"}
                            alt={m.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white font-medium truncate">
                          {m.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedProject.status === "rejected" && selectedProject.reason && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-600 dark:text-red-400 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {selectedProject.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;