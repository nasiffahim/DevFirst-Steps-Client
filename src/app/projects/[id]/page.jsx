"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import api from "../../../utils/api";
import useAuth from "../../hooks/useAuth";

const ProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/project/${id}`);
        setProject(response.data);

        if (response.data?.id && user?.email) {
          await checkBookmarkStatus(response.data.id);
        }
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id, user?.email]);

  const checkBookmarkStatus = async (projectId) => {
    try {
      if (!user?.email) {
        setIsBookmarked(false);
        return;
      }

      const response = await api.get(`/bookmarks/check/${projectId}`, {
        params: { email: user.email },
      });

      console.log('Bookmark status:', response.data);
      setIsBookmarked(response.data.isBookmarked);
    } catch (err) {
      console.error("Error checking bookmark status:", err);
      setIsBookmarked(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user?.email) {
      alert("Please login to bookmark projects");
      return;
    }

    if (!project?.id) {
      alert("Project data not loaded");
      return;
    }

    try {
      setBookmarkLoading(true);

      const bookmarkData = {
        email: user.email,
        projectId: project.id,
        projectName: project.name,
        projectDescription: project.description,
        owner: project.owner?.login,
        ownerAvatar: project.owner?.avatar_url,
        stars: project.stargazers_count,
        forks: project.forks_count,
        language: project.language,
        htmlUrl: project.html_url,
        homepage: project.homepage,
        topics: project.topics,
      };

      if (isBookmarked) {
        await api.delete(`/bookmarks/${project.id}?email=${user.email}`);
        setIsBookmarked(false);
        console.log('Bookmark removed');
      } else {
        await api.post("/bookmarks", bookmarkData);
        setIsBookmarked(true);
        console.log('Bookmark added');
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      console.error("Error response:", err.response?.data);
      alert("Failed to update bookmark. Please try again.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Error Loading Project
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The project you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Back to Previous Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-950">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-white/90 dark:hover:bg-slate-800/90"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Previous Page
          </button>

          <button
            onClick={handleBookmarkToggle}
            disabled={bookmarkLoading || !user}
            className={`group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isBookmarked
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700"
                : "bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-white/90 dark:hover:bg-slate-800/90"
            } ${bookmarkLoading || !user ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isBookmarked
                  ? "scale-110 fill-current"
                  : "group-hover:scale-110"
              }`}
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className="font-semibold">
              {bookmarkLoading
                ? "Loading..."
                : isBookmarked
                ? "Bookmarked"
                : "Bookmark"}
            </span>

            {isBookmarked && !bookmarkLoading && (
              <span className="absolute inset-0 rounded-lg bg-pink-400 opacity-0 animate-ping"></span>
            )}
          </button>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  {project.name?.charAt(0)?.toUpperCase() || "P"}
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {project.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    by {project.owner?.login}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                {project.description || "No description available"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="text-yellow-600 dark:text-yellow-400 text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(project.stargazers_count)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">🍴</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(project.forks_count)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forks</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-green-600 dark:text-green-400 text-2xl mb-2">👀</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(project.watchers_count)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Watchers</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 text-2xl mb-2">🐛</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {project.open_issues_count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Issues</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Repository Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                    Owner
                  </label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                    <img
                      src={project.owner?.avatar_url}
                      alt={project.owner?.login}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {project.owner?.login}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                    Primary Language
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200 dark:border-blue-800">
                      {project.language || "Not specified"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                    Repository Size
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {(project.size / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
                    Default Branch
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {project.default_branch}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {project.topics && project.topics.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Topics & Technologies
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-800 dark:text-purple-300 rounded-full text-sm font-semibold border border-purple-200 dark:border-purple-800 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/60 dark:hover:to-pink-900/60 transition-all duration-200"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.license && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                  License
                </h2>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h3 className="font-bold text-green-800 dark:text-green-300 text-lg mb-2">
                    {project.license.name}
                  </h3>
                  <p className="text-green-700 dark:text-green-400 text-sm">
                    SPDX ID: {project.license.spdx_id}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg hover:from-gray-900 hover:to-black dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View on GitHub
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9m9 9c5 0 9-4 9-9m-9 9c0-5 4-9 9-9m-9 9c0 5-4 9 9-9"
                      />
                    </svg>
                    Visit Website
                  </a>
                )}
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(project.clone_url)
                  }
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Clone URL
                </button>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Repository Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Created</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDate(project.created_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Updated</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDate(project.updated_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Pushed</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDate(project.pushed_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Visibility</span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${
                      project.private
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                        : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    }`}
                  >
                    {project.private ? "Private" : "Public"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100 dark:border-slate-700">
                  <span className="text-gray-600 dark:text-gray-400">Has Issues</span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${
                      project.has_issues
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {project.has_issues ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Archived</span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${
                      project.archived
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    }`}
                  >
                    {project.archived ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;