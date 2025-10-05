"use client";

import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  CheckCircle,
  Clock,
  MessageCircle,
  Pencil,
  Star,
  Tag,
  Trash2,
  TrendingUp,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { VoteButtons } from "../../../Components/shared/VoteButtons";
import { Comments } from "../../../Components/shared/Comments";
import { useRouter } from "next/navigation";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Link from "next/link";

const MyDiscussion = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [hoveredDiscussion, setHoveredDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Safe fetch user posts
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      if (!user?.email || !axiosSecure) return;

      try {
        const response = await axiosSecure.get(
          `/api/my/posts?email=${user.email}`
        );
        if (isMounted) {
          setPosts(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) setError("Failed to fetch your posts.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [user?.email, axiosSecure]);

  // Handle edit
  const handleEdit = useCallback(
    (id) => {
      if (id) {
        router.push(`/dashboard/my-discussion/${id}`);
      }
    },
    [router]
  );

  //  Handle delete with confirmation
  const handleDelete = useCallback(
    (id) => {
      if (!id) return;

      Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosSecure.delete(`/remove/posts/${id}`);
            setPosts((prev) => prev.filter((p) => p._id !== id));
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Your post has been removed.",
              timer: 1500,
              showConfirmButton: false,
            });
          } catch (err) {
            console.error("Delete error:", err);
            Swal.fire({
              icon: "error",
              title: "Failed!",
              text: "Something went wrong. Try again.",
            });
          }
        }
      });
    },
    [axiosSecure]
  );

  //  UI: Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"
          role="status"
          aria-label="Loading..."
        />
      </div>
    );
  }

  //  UI: Error state
  if (error) {
    return <p className="text-red-500 text-center py-6">{error}</p>;
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "active":
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case "featured":
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "solved":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "active":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "featured":
        return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      if (hours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-900 dark:bg-gray-800 shadow-lg mb-4">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            My Discussions
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Manage your conversations and engage with the community
          </p>

          {/* Count Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {posts.length} Discussion{posts.length !== 1 ? "s" : ""} Created
            </span>
          </div>
        </div>
        {/* Discussions List */}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className={`group relative rounded-xl border ${
                  hoveredDiscussion === post._id
                    ? "border-blue-300 dark:border-blue-700 shadow-lg"
                    : "border-gray-200 dark:border-gray-800 shadow-sm"
                } hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900`}
                onMouseEnter={() => setHoveredDiscussion(post._id)}
                onMouseLeave={() => setHoveredDiscussion(null)}
              >
                {/* Status Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                      post.status
                    )}`}
                  >
                    {getStatusIcon(post.status)}
                    <span className="capitalize">{post.status}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {post?.author?.avatar ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                          <img
                            src={post?.author?.avatar}
                            alt={post?.author?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white ring-2 ring-gray-200 dark:ring-gray-700">
                          {post?.author?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <Link
                        href={`/discussions/${post._id}`}
                        className="block group/title"
                      >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>

                      {/* Author and Time */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {post?.author?.name}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">
                          •
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTimestamp(post.timestamp)}</span>
                        </div>
                      </div>

                      {/* Preview */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                        {post.content}
                      </p>

                      {/* Category and Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Metrics */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 relative">
                        {/* Original metrics - hide on hover */}
                        <div
                          className={`flex items-center gap-6 transition-all duration-300 ${
                            hoveredDiscussion === post._id
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                        >
                          <VoteButtons
                            discussionId={post._id}
                            initialVotes={post.votes}
                            initialUserVote={post.userVote}
                          />
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-medium">
                              {post?.commentsSummary?.totalComments || 0}{" "}
                              replies
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Created at{" "}
                            {new Date(post.timestamp).toLocaleString()}
                          </div>
                        </div>

                        {/* Action buttons - show on hover */}
                        <div
                          className={`absolute left-0 flex gap-3 transition-all duration-300 ${
                            hoveredDiscussion === post._id
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-2 pointer-events-none"
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEdit(post._id);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                          >
                            <Pencil className="w-4 h-4" /> Edit
                          </button>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(post._id);
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>

                        {/* Join Discussion */}
                        <Link
                          href={`/discussions/${post._id}`}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md group/button relative z-10"
                        >
                          <span>Join Discussion</span>
                          <MessageCircle className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover effect border */}
                <div
                  className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
                    hoveredDiscussion === post._id ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                No discussions yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Be the first to start a conversation!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyDiscussion;
