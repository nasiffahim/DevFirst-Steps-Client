"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "../../../utils/api";
import useAuth from "../../hooks/useAuth";
import ProjectDetails from "../components/ProjectDetails";
import HealthMetrics from "../components/HealthMetrics";
import ContributionScore from "../components/ContributionScore";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("details");
  const [userData, setUserData] = useState(null);
  const [githubUsername, setGithubUsername] = useState("");

  // Fetch user data from API when user is logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const response = await api.get("/single_user", {
            params: { emailParams: user.email },
          });
          setUserData(response.data);
          
          // Extract GitHub username from user data
          const username = extractGithubUsername(response.data.github) || 
                         response.data.githubUsername || 
                         response.data.username?.toLowerCase().replace(/\s+/g, '');
          
          if (username) {
            setGithubUsername(username);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    };

    fetchUserData();
  }, [user?.email]);

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

      setIsBookmarked(response.data.isBookmarked);
    } catch (err) {
      console.error("Error checking bookmark status:", err);
      setIsBookmarked(false);
    }
  };

  const handleBookmarkToggle = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

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
      } else {
        await api.post("/bookmarks", bookmarkData);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      alert("Failed to update bookmark. Please try again.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  // Extract GitHub username from GitHub URL
  const extractGithubUsername = (githubUrl) => {
    if (!githubUrl) return null;
    
    try {
      const urlPattern = /github\.com\/([a-zA-Z0-9_-]+)/i;
      const match = githubUrl.match(urlPattern);
      return match ? match[1] : null;
    } catch (err) {
      console.error("Error extracting GitHub username:", err);
      return null;
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Back and Bookmark */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
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

          {/* Bookmark Button */}
          <div
            onClick={handleBookmarkToggle}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ isolation: 'isolate' }}
            className={`cursor-pointer group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isBookmarked
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700"
                : "bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-white/90 dark:hover:bg-slate-800/90"
            } ${
              bookmarkLoading || !user ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
            }`}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isBookmarked ? "scale-110 fill-current" : "group-hover:scale-110"
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
          </div>
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
              <div className="text-yellow-600 dark:text-yellow-400 text-2xl mb-2">
                ⭐
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(project.stargazers_count)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
                🍴
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(project.forks_count)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forks</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="text-green-600 dark:text-green-400 text-2xl mb-2">
                👀
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {formatNumber(project.watchers_count)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Watchers
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <div className="text-red-600 dark:text-red-400 text-2xl mb-2">
                🐛
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {project.open_issues_count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Issues</div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 mb-8 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === "details"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Project Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab("health")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === "health"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Repository Health
              </div>
            </button>
            <button
              onClick={() => setActiveTab("contribution")}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-200 ${
                activeTab === "contribution"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Your Contribution
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && <ProjectDetails project={project} />}
        {activeTab === "health" && <HealthMetrics project={project} />}
        {activeTab === "contribution" && (
          <ContributionScore project={project} username={githubUsername} />
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;