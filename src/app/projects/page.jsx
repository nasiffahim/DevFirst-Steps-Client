"use client";
import { useState, useEffect } from "react";

const GithubProjectFinder = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState([]); // multiple filters
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const perPage = 9;

  // Define filter options (topics/languages)
  const filterOptions = [
    { id: "javascript", label: "JavaScript", type: "language" },
    { id: "python", label: "Python", type: "language" },
    { id: "java", label: "Java", type: "language" },
    { id: "ml", label: "Machine Learning", type: "topic" },
    { id: "ai", label: "AI", type: "topic" },
    { id: "web", label: "Web", type: "topic" },
    { id: "backend", label: "Backend", type: "topic" },
    { id: "cloud", label: "Cloud", type: "topic" },
    { id: "gaming", label: "Gaming", type: "topic" },
  ];

  const fetchProjects = async () => {
    if (!query.trim() && filters.length === 0) return;

    setLoading(true);
    setError("");
    setProjects([]);

    try {
      let searchQuery = query ? `${query} in:name,description` : "";

      // Add selected filters
      filters.forEach((f) => {
        const option = filterOptions.find((opt) => opt.id === f);
        if (option) {
          searchQuery += option.type === "language" ? ` language:${option.id}` : ` topic:${option.id}`;
        }
      });

      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(
          searchQuery.trim()
        )}&sort=stars&order=desc&per_page=${perPage}&page=${page}`
      );

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data.items || []);
      setTotalCount(data.total_count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when page or filters change
  useEffect(() => {
    if (query || filters.length > 0) fetchProjects();
  }, [page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // reset to page 1
    fetchProjects();
  };

  const toggleFilter = (id) => {
    setFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🔍 Open Source Project Finder
      </h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by keyword (e.g. react, python)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-3 mb-6">
        {filterOptions.map((opt) => (
          <label key={opt.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.includes(opt.id)}
              onChange={() => toggleFilter(opt.id)}
              className="w-4 h-4"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Loading */}
      {loading && <p className="text-center text-gray-600">Loading projects...</p>}

      {/* Error */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {projects.map((repo) => (
          <div
            key={repo.id}
            className="p-4 border rounded-lg shadow hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg mb-2">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {repo.name}
              </a>
            </h2>
            <p className="text-sm text-gray-700 mb-2">
              {repo.description?.slice(0, 100) || "No description available"}
            </p>
            <div className="flex justify-between text-sm text-gray-600">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && projects.length === 0 && (query || filters.length > 0) && !error && (
        <p className="text-center text-gray-500 mt-6">No projects found.</p>
      )}

      {/* Pagination */}
      {projects.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {Math.ceil(totalCount / perPage)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(totalCount / perPage)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default GithubProjectFinder;
