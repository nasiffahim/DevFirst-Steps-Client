"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Github, Users, Calendar, Tag } from "lucide-react";

// 🧩 Helper Functions
const getLanguageIcon = (language) => {
  switch (language?.toLowerCase()) {
    case "javascript":
      return "🟨";
    case "python":
      return "🐍";
    case "java":
      return "☕";
    case "react":
      return "⚛️";
    default:
      return "💻";
  }
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "border-green-500 text-green-600";
    case "medium":
      return "border-yellow-500 text-yellow-600";
    case "hard":
      return "border-red-500 text-red-600";
    default:
      return "border-gray-400 text-gray-500";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? "Unknown" : date.toLocaleDateString();
};

// ✅ Reusable Project Card Component
const ProjectCard = ({ project }) => {
  const router = useRouter(); // ✅ Define router inside component

  return (
    <div
      onClick={() => router.push(`/dashboard/my-projects/${project._id}`)}
      className="cursor-pointer bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/50 
                 hover:shadow-2xl dark:hover:shadow-gray-900/70 transform hover:-translate-y-2 
                 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
    >
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{getLanguageIcon(project.language)}</span>
            <div>
              <h3 className="font-bold text-lg truncate">{project.name}</h3>
              <p className="text-gray-300 dark:text-gray-400 text-sm capitalize">
                {project.language}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
              project.difficulty
            )} bg-white dark:bg-gray-900`}
          >
            {project.difficulty || "N/A"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        <h2 className="text-sm text-gray-700 dark:text-gray-300">
          Author Name:{" "}
          <span className="font-medium">{project.AuthorName || "Unknown"}</span>
        </h2>
        <h2 className="text-sm text-gray-700 dark:text-gray-300">
          Author Email:{" "}
          <span className="font-medium">{project.AuthorEmail || "N/A"}</span>
        </h2>
        {project.AuthorPhoto && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Author Photo:</span>
            <img
              className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700"
              src={project.AuthorPhoto}
              alt={project.AuthorName || "Author"}
            />
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
          {project.description || "No description provided."}
        </p>

        {/* Tags */}
        {project.tags && (
          <div className="flex items-center mb-4">
            <Tag className="w-4 h-4 text-gray-400 dark:text-gray-600 mr-2" />
            <div className="flex flex-wrap gap-1">
              {project.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-6">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>
              {project.contributors || 0} contributor
              {(project.contributors || 0) !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={(e) => e.stopPropagation()} // ✅ Prevent parent click
            >
              <Github className="w-4 h-4 mr-2" />
              View Code
            </a>
          )}

          <Link
            href={`/dashboard/my-projects/${project._id}`}
            className="inline-flex items-center justify-center px-4 py-2 border-2 border-gray-900 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            onClick={(e) => e.stopPropagation()} // ✅ Prevent parent click
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
