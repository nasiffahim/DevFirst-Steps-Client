"use client";

import React, { useEffect, useState } from "react";
import {
  Code,
  Star,
  GitFork,
  Calendar,
  ExternalLink,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "../../utils/api";

export default function JavaScriptHubPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = "JavaScript";

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/project/git/${category}`, {
          params: { per_page: 100 },
        });

        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err.response?.data?.error ||
            "Failed to fetch projects. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-yellow-500 dark:text-yellow-400 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading JavaScript Projects...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-500/50 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">
              Error
            </h3>
          </div>
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-400/10 rounded-xl">
              <Code className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                JavaScript Hub
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Explore popular JavaScript repositories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Code className="w-4 h-4" />
            <span>
              {projects.length}{" "}
              {projects.length === 1 ? "repository" : "repositories"} found
            </span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700/50 hover:border-yellow-400 dark:hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] flex flex-col"
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                      {project.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700/50 rounded-md text-gray-700 dark:text-gray-300">
                        {project.language || "JavaScript"}
                      </span>
                    </div>
                  </div>
                  <Code className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" />
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                  {project.description ||
                    "No description available for this repository."}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Star className="w-4 h-4" />
                    <span>{formatNumber(project.stargazers_count || 0)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <GitFork className="w-4 h-4" />
                    <span>{formatNumber(project.forks_count || 0)}</span>
                  </div>
                  {project.open_issues_count > 0 && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>{formatNumber(project.open_issues_count)}</span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700/50">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(project.created_at)}</span>
                  </div>
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-400/10 hover:bg-yellow-200 dark:hover:bg-yellow-400/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm font-medium transition-all duration-200 hover:gap-3"
                  >
                    <span>View</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}