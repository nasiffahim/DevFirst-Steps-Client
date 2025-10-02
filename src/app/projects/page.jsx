"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import SearchAndFilters from "./components/SearchAndFilters";
import ProjectGrid from "./components/ProjectGrid";
import { filterCategories } from "./components/filterCategories ";

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

      const { data } = await api.get("/all_projects", { params });
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

      const { data } = await api.get("/all_projects", { params });
      setProjects(data.items || []);
      setTotalCount(data.total_count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaultProjects(1);
  }, []);

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

  const handleViewDetails = (projectId) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold pb-3 mt-4 mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent inline-block h-auto">
            Open Source Project Explorer
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing open source projects and explore the latest
            technologies
          </p>
        </div>

        <SearchAndFilters
          query={query}
          setQuery={setQuery}
          filters={filters}
          activeCategory={activeCategory}
          handleSearch={handleSearch}
          handleCategoryChange={handleCategoryChange}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
        />

        <ProjectGrid
          projects={projects}
          loading={loading}
          error={error}
          isDefaultView={isDefaultView}
          page={page}
          setPage={setPage}
          totalCount={totalCount}
          perPage={perPage}
          handleViewDetails={handleViewDetails}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
};

export default GithubProjectFinder;