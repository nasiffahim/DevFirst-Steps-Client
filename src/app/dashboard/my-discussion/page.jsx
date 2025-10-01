"use client";

import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { Clock, Pencil, Trash2 } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { VoteButtons } from "../../../Components/shared/VoteButtons";
import { Comments } from "../../../Components/shared/Comments";
import { useRouter } from "next/navigation";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyDiscussion = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  Safe fetch user posts
  useEffect(() => {
    let isMounted = true;

    const fetchPosts = async () => {
      if (!user?.email || !axiosSecure) return;

      try {
        const response = await axiosSecure.get(`/api/my/posts?email=${user.email}`);
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
  const handleEdit = useCallback((id) => {
    if (id) {
      router.push(`/dashboard/my-discussion/${id}`);
    }
  }, [router]);

  //  Handle delete with confirmation
  const handleDelete = useCallback((id) => {
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
  }, [axiosSecure]);

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

  //  UI: Main content
  return (
    <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-10">
        My Discussions
      </h2>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post, index) => (
            <article
              key={post._id || index}
              className="p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
                         rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Title */}
              <h3 className="text-lg sm:text-xl font-semibold mb-3 text-white">
                {post.title || "Untitled"}
              </h3>

              {/* Preview */}
              <p className="text-gray-300 mb-4 text-sm sm:text-base line-clamp-3">
                {post.preview || "No preview available."}
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap gap-5 items-center text-xs sm:text-sm mb-4 text-gray-400">
                <VoteButtons
                  discussionId={post._id}
                  initialVotes={post.votes}
                  initialUserVote={post.userVote}
                />

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {post.timestamp
                      ? new Date(post.timestamp).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Unknown time"}
                  </span>
                </div>
              </div>

              {/* Comments */}
              <Comments discussionId={post._id} />

              {/* Actions */}
              <div className="flex gap-3 flex-wrap mt-4">
                <button
                  onClick={() => handleEdit(post._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl 
                             bg-gradient-to-r from-blue-500 to-indigo-600 
                             text-white font-medium shadow-md 
                             hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </button>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl 
                             bg-gradient-to-r from-pink-500 to-rose-500
                             text-white font-medium shadow-md 
                             hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">You have no posts yet.</p>
      )}
    </section>
  );
};

export default MyDiscussion;
