"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../../app/hooks/useAuth";
import api from "../../../utils/api";
import {
  Bookmark,
  BookmarkX,
  Star,
  GitFork,
  ExternalLink,
  Github,
  Code2,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

const BookmarkedProjects = () => {
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookmarks, setTotalBookmarks] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookmarks();
  }, [currentPage]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError("");

      const userEmail = user.email;

      if (!userEmail) {
        setError("Please login to view bookmarks");
        setLoading(false);
        return;
      }

      const response = await api.get(`/bookmarks/${userEmail}`, {
        params: {
          page: currentPage,
          limit: 12,
          sort: "bookmarkedAt",
        },
      });

      setBookmarks(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setTotalBookmarks(response.data.pagination.total);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (projectId) => {
    try {
      await api.delete(`/bookmarks/${projectId}?email=${user.email}`);
      fetchBookmarks();
    } catch (err) {
      console.error("Error removing bookmark:", err);
      alert("Failed to remove bookmark");
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num?.toLocaleString() || 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-900 dark:text-gray-300 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading bookmarks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-gray-800 rounded-full mb-4">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Bookmarks
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {totalBookmarks} {totalBookmarks === 1 ? "project" : "projects"}{" "}
            saved for later
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {bookmarks.length === 0 && !loading && !error ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            {/* <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" /> */}
            <p className="text-[64px] text-gray-400 dark:text-gray-600 mx-auto mb-4">
              📚
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Bookmarks Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start bookmarking projects to see them here!
            </p>
            <button
              onClick={() => router.push("/projects")}
              className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 font-medium inline-flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              Explore Projects
            </button>
          </div>
        ) : (
          <>
            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark._id}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 group flex flex-col"
                >
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={bookmark.ownerAvatar}
                        alt={bookmark.owner}
                        className="w-10 h-10 rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                          {bookmark.projectName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          by {bookmark.owner}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.projectId)}
                      className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors p-2 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg flex-shrink-0"
                      title="Remove bookmark"
                    >
                      <BookmarkX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-700 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {bookmark.projectDescription || "No description available"}
                  </p>

                  {/* Language Badge */}
                  {bookmark.language && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold rounded-full border border-gray-200 dark:border-gray-700">
                        <Code2 className="w-3 h-3" />
                        {bookmark.language}
                      </span>
                    </div>
                  )}

                  {/* Topics */}
                  {bookmark.topics && bookmark.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bookmark.topics.slice(0, 3).map((topic, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700"
                        >
                          {topic}
                        </span>
                      ))}
                      {bookmark.topics.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-700">
                          +{bookmark.topics.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Spacer */}
                  <div className="flex-1"></div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{formatNumber(bookmark.stars)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <GitFork className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                      <span>{formatNumber(bookmark.forks)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/project/${bookmark.projectId}`)
                      }
                      className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Details
                    </button>
                    <a
                      href={bookmark.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 text-sm font-medium flex items-center justify-center border border-gray-200 dark:border-gray-700"
                      title="View on GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                        currentPage === index + 1
                          ? "bg-gray-900 dark:bg-gray-800 text-white"
                          : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookmarkedProjects;
