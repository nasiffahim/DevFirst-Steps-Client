"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api"

const GithubProjectFinder = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDefaultView, setIsDefaultView] = useState(true);

  const perPage = 9;

  // Enhanced filter options organized by categories
  const filterCategories = {
    all: [
      { id: "javascript", label: "JavaScript", type: "language" },
      { id: "python", label: "Python", type: "language" },
      { id: "java", label: "Java", type: "language" },
      { id: "react", label: "React", type: "topic" },
      { id: "vue", label: "Vue.js", type: "topic" },
      { id: "angular", label: "Angular", type: "topic" },
      { id: "nodejs", label: "Node.js", type: "topic" },
      { id: "machine-learning", label: "Machine Learning", type: "topic" },
      { id: "artificial-intelligence", label: "AI", type: "topic" },
      { id: "docker", label: "Docker", type: "topic" },
      { id: "kubernetes", label: "Kubernetes", type: "topic" },
    ],
    web: [
      { id: "react", label: "React", type: "topic" },
      { id: "nextjs", label: "Next.js", type: "topic" },
      { id: "vue", label: "Vue.js", type: "topic" },
      { id: "angular", label: "Angular", type: "topic" },
      { id: "svelte", label: "Svelte", type: "topic" },
      { id: "nodejs", label: "Node.js", type: "topic" },
      { id: "express", label: "Express.js", type: "topic" },
      { id: "typescript", label: "TypeScript", type: "language" },
      { id: "javascript", label: "JavaScript", type: "language" },
      { id: "html", label: "HTML", type: "language" },
      { id: "css", label: "CSS", type: "language" },
    ],
    android: [
      { id: "kotlin", label: "Kotlin", type: "language" },
      { id: "java", label: "Java", type: "language" },
      { id: "flutter", label: "Flutter", type: "topic" },
      { id: "react-native", label: "React Native", type: "topic" },
      { id: "xamarin", label: "Xamarin", type: "topic" },
      { id: "android", label: "Android", type: "topic" },
      { id: "mobile", label: "Mobile", type: "topic" },
    ],
    ios: [
      { id: "swift", label: "Swift", type: "language" },
      { id: "swiftui", label: "SwiftUI", type: "topic" },
      { id: "uikit", label: "UIKit", type: "topic" },
      { id: "objective-c", label: "Objective-C", type: "language" },
      { id: "ios", label: "iOS", type: "topic" },
      { id: "mobile", label: "Mobile", type: "topic" },
      { id: "xcode", label: "Xcode", type: "topic" },
    ],
    ai: [
      { id: "tensorflow", label: "TensorFlow", type: "topic" },
      { id: "pytorch", label: "PyTorch", type: "topic" },
      { id: "scikit-learn", label: "Scikit-learn", type: "topic" },
      { id: "keras", label: "Keras", type: "topic" },
      { id: "opencv", label: "OpenCV", type: "topic" },
      { id: "pandas", label: "Pandas", type: "topic" },
      { id: "numpy", label: "NumPy", type: "topic" },
      { id: "jupyter", label: "Jupyter", type: "topic" },
      { id: "machine-learning", label: "Machine Learning", type: "topic" },
      { id: "artificial-intelligence", label: "AI", type: "topic" },
      { id: "deep-learning", label: "Deep Learning", type: "topic" },
      { id: "python", label: "Python", type: "language" },
    ],
    networking: [
      { id: "socketio", label: "Socket.io", type: "topic" },
      { id: "graphql", label: "GraphQL", type: "topic" },
      { id: "rest-api", label: "REST API", type: "topic" },
      { id: "grpc", label: "gRPC", type: "topic" },
      { id: "webrtc", label: "WebRTC", type: "topic" },
      { id: "nginx", label: "Nginx", type: "topic" },
      { id: "api", label: "API", type: "topic" },
      { id: "websocket", label: "WebSocket", type: "topic" },
    ],
    database: [
      { id: "postgresql", label: "PostgreSQL", type: "topic" },
      { id: "mysql", label: "MySQL", type: "topic" },
      { id: "mongodb", label: "MongoDB", type: "topic" },
      { id: "redis", label: "Redis", type: "topic" },
      { id: "sqlite", label: "SQLite", type: "topic" },
      { id: "firebase", label: "Firebase", type: "topic" },
      { id: "database", label: "Database", type: "topic" },
      { id: "sql", label: "SQL", type: "language" },
    ],
    cloud: [
      { id: "aws", label: "AWS", type: "topic" },
      { id: "google-cloud", label: "Google Cloud", type: "topic" },
      { id: "azure", label: "Azure", type: "topic" },
      { id: "docker", label: "Docker", type: "topic" },
      { id: "kubernetes", label: "Kubernetes", type: "topic" },
      { id: "terraform", label: "Terraform", type: "topic" },
      { id: "cloud", label: "Cloud", type: "topic" },
      { id: "devops", label: "DevOps", type: "topic" },
    ],
    gaming: [
      { id: "unity", label: "Unity", type: "topic" },
      { id: "unreal-engine", label: "Unreal Engine", type: "topic" },
      { id: "godot", label: "Godot", type: "topic" },
      { id: "csharp", label: "C#", type: "language" },
      { id: "cpp", label: "C++", type: "language" },
      { id: "blender", label: "Blender", type: "topic" },
      { id: "game-development", label: "Game Development", type: "topic" },
      { id: "3d", label: "3D", type: "topic" },
    ],
  };

  // Load popular projects by default when component mounts
  const fetchDefaultProjects = async (currentPage = page) => {
    setLoading(true);
    setError("");
    setIsDefaultView(true);

    try {
      const params = new URLSearchParams({
        query: "",
        lang: "",
        topics: "",
        stars: 10000,
        forks: 100,
        sort: "stars",
        order: "desc",
        page: currentPage,
        perPage: perPage,
      });

      const { data } = await api.get("/all_projects", {
        params,
      });
      setProjects(data.items || []);
      setTotalCount(data.total_count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    if (!query.trim() && filters.length === 0) {
      fetchDefaultProjects();
      return;
    }

    setLoading(true);
    setError("");
    setProjects([]);
    setIsDefaultView(false);

    try {
      const allFilters = Object.values(filterCategories).flat();
      const languages = filters
        .map((f) => allFilters.find((opt) => opt.id === f))
        .filter((opt) => opt?.type === "language")
        .map((opt) => opt.id);

      const topics = filters
        .map((f) => allFilters.find((opt) => opt.id === f))
        .filter((opt) => opt?.type === "topic")
        .map((opt) => opt.id);

      const params = new URLSearchParams({
        query,
        lang: languages[0] || "",
        topics: topics.join(","),
        stars: 100,
        forks: 10,
        sort: "stars",
        order: "desc",
        page,
        perPage,
      });

      const { data } = await api.get("/all_projects", {
        params,
      });
      setProjects(data.items || []);
      setTotalCount(data.total_count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load default projects on component mount
  useEffect(() => {
    fetchDefaultProjects(1);
  }, []);

  // Handle page changes for both default and filtered views
  useEffect(() => {
    if (query || filters.length > 0) {
      fetchProjects();
    } else {
      fetchDefaultProjects(page);
    }
  }, [page, filters]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const toggleFilter = (id) => {
    setFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setFilters([]);
    setQuery("");
    setPage(1);
    fetchDefaultProjects(1);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setFilters([]);
    setPage(1);
  };

  // Navigate to project details page
  const handleViewDetails = (projectId) => {
    router.push(`/projects/${projectId}`);
  };

  const currentFilters = filterCategories[activeCategory] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with enhanced styling */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold pb-3 mt-4 mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent inline-block h-auto">
            Open Source Project Explorer
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing open source projects and explore the latest
            technologies
          </p>
        </div>

        {/* Enhanced Search Form */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Explore projects by language or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
              className="w-full pl-10 pr-4 py-3 text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 text-base font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Enhanced Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {Object.keys(filterCategories).map((category) => {
              const categoryIcons = {
                all: "⚡",
                web: "🌐",
                android: "📱",
                ios: "📱",
                ai: "🤖",
                networking: "🔗",
                database: "💾",
                cloud: "☁️",
                gaming: "🎮",
              };

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${
                    activeCategory === category
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white border-none shadow-md"
                      : "bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-sm hover:shadow-md"
                  }`}
                >
                  <span className="text-sm">{categoryIcons[category]}</span>
                  <span className="capitalize font-semibold text-sm">
                    {category === "ai" ? "AI/ML" : category.replace("-", " ")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Enhanced Active Filters Display */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center justify-center mb-6 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-600">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Active filters:
              </span>
              {filters.map((filterId) => {
                const allFilters = Object.values(filterCategories).flat();
                const filter = allFilters.find((f) => f.id === filterId);
                return (
                  <span
                    key={filterId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-full text-sm font-medium shadow-md"
                  >
                    {filter?.label}
                    <button
                      onClick={() => toggleFilter(filterId)}
                      className="ml-1 text-white/80 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                );
              })}
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline font-medium transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Enhanced Filter Options */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">
            {activeCategory === "all"
              ? "Popular Technologies"
              : `${
                  activeCategory.charAt(0).toUpperCase() +
                  activeCategory.slice(1)
                } Technologies`}
          </h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {currentFilters.map((opt) => (
              <label
                key={opt.id}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-none cursor-pointer transition-all duration-300 text-sm font-semibold transform hover:scale-105 shadow-sm hover:shadow-md ${
                  filters.includes(opt.id)
                    ? "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white"
                    : "border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white/90 dark:hover:bg-gray-800/90"
                }`}
              >
                <input
                  type="checkbox"
                  checked={filters.includes(opt.id)}
                  onChange={() => toggleFilter(opt.id)}
                  className={`w-3 h-3 rounded focus:ring-2 focus:ring-offset-1 ${
                    filters.includes(opt.id)
                      ? "text-white border-none focus:ring-white"
                      : "text-blue-600 dark:text-blue-400 border-gray-400 dark:border-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400"
                  }`}
                />
                <span className="select-none">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Enhanced Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 mb-3"></div>
            <p className="text-gray-600 dark:text-gray-400">
              {isDefaultView
                ? "Loading trending projects..."
                : "Finding amazing repositories..."}
            </p>
          </div>
        )}

        {/* Enhanced Error */}
        {error && (
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-3 text-gray-600 dark:text-gray-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg border-2 border-red-200 dark:border-red-800">
              <svg
                className="w-5 h-5 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Popular Projects Label */}
        {isDefaultView && projects.length > 0 && !loading && (
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-3 rounded-2xl shadow-lg mb-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <div className="flex items-center gap-2 justify-center">
                <span className="text-2xl">🔥</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Hot & Popular Projects</h2>
                <span className="text-2xl">🔥</span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              Discover trending open source projects with thousands of stars
            </p>
            <div className="flex justify-center gap-6 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-yellow-500 dark:text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">10000+ Stars</span>
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-blue-500 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span className="font-medium">100+ Forks</span>
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="font-medium">Actively Maintained</span>
              </span>
            </div>
          </div>
        )}

        {/* Search Results Label */}
        {!isDefaultView && projects.length > 0 && !loading && (
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white px-4 py-2 rounded-xl shadow-md">
              <h2 className="text-lg font-bold flex items-center gap-2">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Results
              </h2>
            </div>
          </div>
        )}

        {/* Enhanced Results Grid with View Details Button */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((repo) => (
            <div
              key={repo.id}
              className="p-5 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg dark:hover:shadow-gray-700/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group transform hover:scale-105 flex flex-col"
            >
              {/* Top Section */}
              <div className="flex items-start justify-between mb-3">
                <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100 leading-tight flex-1 pr-2 truncate">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 dark:text-gray-100 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-400 dark:hover:to-purple-400 hover:bg-clip-text hover:text-transparent group-hover:underline transition-all duration-200"
                  >
                    {repo.name}
                  </a>
                </h2>
                {repo.language && (
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold rounded-full border border-blue-200 dark:border-blue-700">
                    {repo.language}
                  </span>
                )}
              </div>

              {/* Make description flexible */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-1">
                {repo.description || "No description available"}
              </p>

              {/* Bottom Section */}
              <div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 font-medium">
                      ⭐ {repo.stargazers_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      🍴 {repo.forks_count.toLocaleString()}
                    </span>
                  </div>
                  {repo.updated_at && (
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleViewDetails(repo.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-600 dark:hover:to-purple-700 text-gray-700 dark:text-gray-300 hover:text-white rounded-lg transition-all duration-300 text-sm font-medium border border-gray-200 dark:border-gray-600 hover:border-transparent"
                >
                  <span>View Details</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {!loading && projects.length === 0 && !isDefaultView && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              No projects found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800 transition-all duration-200 font-medium"
            >
              Show Popular Projects
            </button>
          </div>
        )}

        {/* Enhanced Pagination */}
        {projects.length > 0 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-600"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg">
              Page {page} of {Math.ceil(totalCount / perPage)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(totalCount / perPage)}
              className="px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200 font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-gray-600"
            >
              Next
            </button>
          </div>
        )}

        {/* Enhanced Results Summary */}
        {totalCount > 0 && (
          <div className="text-center mt-6">
            <div className="inline-block bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-md">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                {isDefaultView ? "🔥 Trending: " : "Found "}
                {totalCount.toLocaleString()} repositories
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GithubProjectFinder;
