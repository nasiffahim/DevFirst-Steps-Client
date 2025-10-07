"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TagSelector from "./TagSelector";
import useAuth from "../../hooks/useAuth";
import ProtectedPage from "../../../Components/Protected/ProtectedPage";
import ImageUpload from "../../../Components/register/ImageUpload/ImageUpload";
import api from "../../../utils/api";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
  FileText,
  FolderOpen,
  AlignLeft,
  Tag,
  Send,
  AlertCircle,
  CheckCircle,
  Flame,
  Star,
  Circle,
} from "lucide-react";

export default function CommunityCreate() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [imageUrl, setImageUrl] = useState(null); // Stores image URL
  const [selectedTags, setSelectedTags] = useState([]); // Stores selected tags
  const { user } = useAuth(); // User data from auth hook
  const userEmail = user?.email;
  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        preview: data.content.slice(0, 100),
        category: data.category,
        content: data.content,
        status: data.status || "active",
        tags: selectedTags,
        author: {
          name: user?.displayName || "Anonymous",
          avatar: user?.photoURL || "👤",
        },
        email: user?.email,
      };

      console.log("Payload:", payload);

      const response = await api.post(
        "/create_post",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Discussion created:", response.data);

      if (userEmail) {
        await api.post("/update-activity", {
          email: userEmail,
          activityType: "discussion-participation",
        });
      }
      // ✅ Show success alert
      Swal.fire({
        title: "Success!",
        text: "Your discussion was created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/dashboard/my-discussion");
      });
      reset();
      setSelectedTags([]);
      setImageUrl(null);

      reset();
      setSelectedTags([]);
      setImageUrl(null);
    } catch (error) {
      console.error("Failed to create discussion:", error);

      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <Circle className="w-4 h-4" />;
      case "solved":
        return <CheckCircle className="w-4 h-4" />;
      case "featured":
        return <Star className="w-4 h-4" />;
      case "hot":
        return <Flame className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create a Discussion
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your thoughts and start a conversation with the community
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="p-6 sm:p-8 space-y-6"
            >
              {/* Title Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FileText className="w-4 h-4" />
                  Discussion Title
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter a descriptive title for your discussion"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                />
                {errors.title && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <p>{errors.title.message}</p>
                  </div>
                )}
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <FolderOpen className="w-4 h-4" />
                  Category
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("category", {
                    required: "Category is required",
                  })}
                  placeholder="e.g., Technology, Web Development, Design"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                />
                {errors.category && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <p>{errors.category.message}</p>
                  </div>
                )}
              </div>

              {/* Content Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <AlignLeft className="w-4 h-4" />
                  Discussion Content
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("content", { required: "Content is required" })}
                  placeholder="Share your thoughts, questions, or ideas with the community..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all resize-none"
                />
                {errors.content && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <p>{errors.content.message}</p>
                  </div>
                )}
              </div>

              {/* Tag Selector */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="w-4 h-4" />
                  Tags
                </label>
                <TagSelector
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                />
              </div>

              {/* Status Dropdown */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="relative">
                  <select
                    {...register("status")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="active">🔵 Active</option>
                    <option value="solved">✅ Solved</option>
                    <option value="featured">⭐ Featured</option>
                    <option value="hot">🔥 Hot</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose the status that best describes your discussion
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Publish Discussion
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setSelectedTags([]);
                    setImageUrl(null);
                  }}
                  className="flex-1 sm:flex-initial px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Helper Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fields marked with <span className="text-red-500">*</span> are
              required
            </p>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
