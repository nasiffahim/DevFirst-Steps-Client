"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Star,
  GitFork,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  TrendingUp,
  Clock,
  Code2,
  Github,
  ArrowUpDown,
} from "lucide-react";
import api from "../../utils/api";


const BeginnerProjectsFinder = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("stars");
  const [viewType, setViewType] = useState("all");

  const itemsPerPage = 10;

  const languages = [
    "All",
    "JavaScript",
    "Python",
    "Java",
    "TypeScript",
    "Go",
    "Rust",
    "C++",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
    "C#",
  ];

  const sortOptions = [
    { value: "stars", label: "Most Stars" },
    { value: "updated", label: "Recently Updated" },
    { value: "forks", label: "Most Forks" },
    { value: "help-wanted-issues", label: "Help Wanted Issues" },
  ];

  const viewTypes = [
    { value: "all", label: "All Projects", icon: Filter },
    { value: "active", label: "Active (30 days)", icon: Clock },
    { value: "trending", label: "Trending (7 days)", icon: TrendingUp },
  ];

  const fetchProjects = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = "";
      const params = {
        page,
        perPage: itemsPerPage,
        sort: sortBy,
        order: "desc",
      };

      if (language && language !== "All") {
        params.lang = language;
      }

      if (searchQuery) {
        params.query = searchQuery;
      }

      switch (viewType) {
        case "active":
          endpoint = "/projects/beginners/active";
          params.daysAgo = 30;
          break;
        case "trending":
          endpoint = "/projects/beginners/trending";
          break;
        default:
          endpoint = "/projects/beginners/all";
      }

      const response = await api.get(endpoint, { params });

      const data = response.data;
      setProjects(data.items || []);
      setTotalCount(Math.min(data.total_count || 0, 1000));
      setCurrentPage(page);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to fetch projects";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(1);
  }, [language, sortBy, viewType]);

  const handleSearch = () => {
    fetchProjects(1);
  };

  const handlePageChange = (newPage) => {
    const maxPages = Math.ceil(totalCount / itemsPerPage);
    if (newPage >= 1 && newPage <= maxPages) {
      fetchProjects(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl shadow-lg">
              <Github className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-3">
            Beginner-Friendly Open Source
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Discover amazing projects perfect for your first contribution
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
          {/* Search Bar */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Projects
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search projects (e.g., react, machine-learning)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </div>

          {/* View Type Buttons */}
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              View Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3">
              {viewTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setViewType(type.value)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      viewType === type.value
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white shadow-lg transform scale-100"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm sm:text-base">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language and Sort Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 transition-all"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang === "All" ? "" : lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 transition-all"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Showing projects with good first issues, perfect for beginners to start their open source journey
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400"></div>
              <Github className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium">Loading amazing projects...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 font-medium">Error: {error}</p>
            </div>
          </div>
        )}

        {/* Projects List */}
        {!loading && !error && projects.length > 0 && (
          <>
            <div className="space-y-4 sm:space-y-5 mb-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 p-5 sm:p-6 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 break-words">
                        {project.full_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                        {project.description || "No description available"}
                      </p>
                    </div>
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-110"
                      aria-label="View on GitHub"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                    {project.language && (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-800 dark:text-blue-300 px-3 py-1.5 rounded-lg font-medium border border-blue-200 dark:border-blue-800">
                        <Code2 className="w-3.5 h-3.5" />
                        {project.language}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                      <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-current" />
                      <span className="font-semibold">{project.stargazers_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                      <GitFork className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span className="font-semibold">{project.forks_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                      <Eye className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                      <span className="font-semibold">{project.watchers_count.toLocaleString()}</span>
                    </div>
                    {project.open_issues_count > 0 && (
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-lg font-medium border border-green-200 dark:border-green-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {project.open_issues_count} open issues
                      </span>
                    )}
                  </div>

                  {project.topics && project.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.topics.slice(0, 5).map((topic) => (
                        <span
                          key={topic}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-medium border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium text-center sm:text-left">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {totalCount.toLocaleString()}
                  </span>{" "}
                  projects
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {currentPage > 2 && (
                      <>
                        <button
                          onClick={() => handlePageChange(1)}
                          className="hidden sm:block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                        >
                          1
                        </button>
                        {currentPage > 3 && (
                          <span className="text-gray-400 dark:text-gray-500 px-1">...</span>
                        )}
                      </>
                    )}

                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                      >
                        {currentPage - 1}
                      </button>
                    )}

                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white font-bold shadow-md">
                      {currentPage}
                    </button>

                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                      >
                        {currentPage + 1}
                      </button>
                    )}

                    {currentPage < totalPages - 1 && (
                      <>
                        {currentPage < totalPages - 2 && (
                          <span className="text-gray-400 dark:text-gray-500 px-1">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="hidden sm:block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-16 sm:py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-xl font-semibold mb-2">No projects found</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeginnerProjectsFinder;