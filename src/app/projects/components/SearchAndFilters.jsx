import { filterCategories } from "./filterCategories "; 

const SearchAndFilters = ({
  query,
  setQuery,
  filters,
  activeCategory,
  handleSearch,
  handleCategoryChange,
  toggleFilter,
  clearFilters,
}) => {
  const currentFilters = filterCategories[activeCategory] || [];

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
    <>
      {/* Search Form */}
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

      {/* Category Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {Object.keys(filterCategories).map((category) => (
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
          ))}
        </div>

        {/* Active Filters Display */}
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

      {/* Filter Options */}
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
    </>
  );
};

export default SearchAndFilters;