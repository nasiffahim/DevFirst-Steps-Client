"use client";

import React, { useState } from "react";
import { FaGithub } from "react-icons/fa6";
import { Users, Globe2, Briefcase, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import JoinProjectForm from "../../../../Components/Collaboration/Form/JoinProjectForm";
import useAuth from "../../../hooks/useAuth";

export default function ProjectDetails({ project }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!project) return null;

  // --- Dynamic button states ---
  const isOwner = user?.email === project.ownerEmail;
  const teamIsFull = project.members?.length >= Number(project.teamSize);

  const joinDisabled = isOwner || teamIsFull;
  const buttonLabel = isOwner
    ? "You are the Owner"
    : teamIsFull
    ? "Team is Full"
    : "Join Team";

  return (
    <div className="min-h-screen pb-10 transition-colors duration-300">
      <div className="mx-auto space-y-10">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {project.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
                {project.description}
              </p>
            </div>

            <button
              disabled={joinDisabled}
              onClick={() => !joinDisabled && setModalOpen(true)}
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all
                ${
                  joinDisabled
                    ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-green-500 text-white hover:shadow-lg hover:scale-[1.03] active:scale-[0.98]"
                }`}
            >
              {buttonLabel}
            </button>
          </div>

          {/* GitHub Repo */}
          {project.githubRepo && (
            <Link
              href={project.githubRepo}
              target="_blank"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FaGithub className="w-5 h-5" />
              View GitHub Repository
            </Link>
          )}
        </div>

        {/* Project Details Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailCard
            icon={<Briefcase className="w-5 h-5" />}
            label="Project Type"
            value={project.projectType}
          />
          <DetailCard
            icon={<Users className="w-5 h-5" />}
            label="Team Size Goal"
            value={`${project.teamSize} Members`}
          />
          <DetailCard
            icon={<Globe2 className="w-5 h-5" />}
            label="Collaboration Type"
            value={project.collaborationType}
          />
          <DetailCard
            icon={<MessageCircle className="w-5 h-5" />}
            label="Contact Preference"
            value={project.contactPreference}
          />
        </div>

        {/* Skills Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Tech Stack / Skills Needed
          </h2>
          <div className="flex flex-wrap gap-3">
            {project.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-sm text-blue-700 dark:text-blue-300 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Team Members Section */}
{project.members && project.members.length > 0 && (
  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Team Members
    </h2>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {project.members.map((member, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
        >
          {/* Avatar */}
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white font-bold text-lg">
              {member.name?.charAt(0) || "U"}
            </div>
          )}

          {/* Name, Email & Role */}
          <div>
            <p className="text-gray-900 dark:text-gray-100 font-medium">
              {member.name || "Unknown User"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {member.email || "No email"}
            </p>
            {member.role && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                {member.role}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>

      {/* Modal */}
      {modalOpen && !joinDisabled && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <JoinProjectForm
              projectId={project._id}
              user={{
                name: user?.displayName || "",
                email: user?.email || "",
                avatar: user?.photoURL || "",
              }}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-all">
      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-medium text-gray-900 dark:text-gray-100 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
}
