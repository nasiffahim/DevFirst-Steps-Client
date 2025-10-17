"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import api from "../../../utils/api";
import {
  FileText,
  User,
  Tag,
  AlignLeft,
  Save,
  RotateCcw,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import ImageUpload from "../../../Components/register/ImageUpload/ImageUpload"

export default function AddBlogForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();
  const { user } = useAuth();
  const userEmail = user?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !content.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Title, Author, and Content are required",
      });
      return;
    }

    const blog = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      tags,
      content: content.trim(),
      thumbnail: imageUrl || null, // ✅ Firebase URL
      createdAt: new Date().toISOString(),
      AuthorEmail: user?.email,
      AuthorName: user?.displayName,
      AuthorPhoto: user?.photoURL,
    };

    try {
      await api.post("/add-blogs", blog, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (userEmail) {
        await api.post("/update-activity", {
          email: userEmail,
          activityType: "blog-posting",
        });
      }

      Swal.fire({
        icon: "success",
        title: "Blog added successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // reset
      setTitle("");
      setAuthor("");
      setTags("");
      setContent("");
      setImageUrl("");
      router.push("/dashboard/my-blogs");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    }
  };

  const handleReset = () => {
    setTitle("");
    setAuthor("");
    setTags("");
    setContent("");
    setImageUrl("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your thoughts with the world
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4" />
                Blog Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>

            {/* Author */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4" />
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. React, JavaScript"
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>

            {/* Content */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <AlignLeft className="w-4 h-4" />
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="8"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here..."
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700"
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Thumbnail Image
              </label>
              <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                <Save className="w-4 h-4" />
                Publish
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-white border rounded-lg dark:bg-gray-700 dark:text-gray-300"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
