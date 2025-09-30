const ProjectGrid = ({
  projects,
  loading,
  error,
  isDefaultView,
  page,
  setPage,
  totalCount,
  perPage,
  handleViewDetails,
  clearFilters,
}) => {
  return (
    <>
      {/* Loading State */}
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

      {/* Error State */}
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Hot & Popular Projects
              </h2>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map((repo) => (
          <div
            key={repo.id}
            className="p-5 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-lg dark:hover:shadow-gray-700/50 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group transform hover:scale-105 flex flex-col"
          >
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

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-1">
              {repo.description || "No description available"}
            </p>

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

      {/* Empty State */}
      {!loading && projects.length === 0 && !isDefaultView && !error && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">
            🔍
          </div>
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

      {/* Pagination */}
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

      {/* Results Summary */}
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
    </>
  );
};

export default ProjectGrid;