"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Loader2,
  Share2,
  Heart,
} from "lucide-react";
import api from "../../../../utils/api";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/my-blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin mr-2" /> Loading blog details...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>

          <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mb-6">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" /> {blog.AuthorName || blog.author || "Unknown"}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {formatDate(blog.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {Math.ceil(blog.content.split(" ").length / 200)} min read
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8">
            {blog.AuthorPhoto && (
              <img
                src={blog.AuthorPhoto}
                alt={blog.AuthorName}
                className="w-14 h-14 rounded-full object-cover border border-gray-200"
              />
            )}
            <div>
              <h2 className="font-semibold text-gray-900">{blog.AuthorName}</h2>
              <p className="text-sm text-gray-500">{blog.AuthorEmail}</p>
            </div>
          </div>

          {/* Thumbnail */}
          {blog.thumbnail && (
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="w-full h-80 object-cover rounded-xl mb-6"
            />
          )}
        </div>

        {/* Blog Content */}
        <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
          {blog.content}
        </div>

        {/* Tags */}
        {blog.tags && (
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags
              .split(" ")
              .filter((tag) => tag.trim())
              .map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag.trim()}
                </span>
              ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-red-500 transition">
              <Heart className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-blue-500 transition">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Last updated: {formatDate(blog.updatedAt || blog.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
