"use client";

import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import api from "../../../utils/api";
import { FileText, User, Tag, AlignLeft, Image, Save, RotateCcw, Upload } from "lucide-react";

export default function AddBlogForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");
  const [thumbPreview, setThumbPreview] = useState(null);
  const fileRef = useRef(null);

  const handleThumbChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setThumbPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

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
      thumbnail: thumbPreview || null,
      createdAt: new Date().toISOString(),
    };

    console.log(blog, "form data submitted");

    try {
      await api.post("/add-blogs", blog, {
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire({
        icon: "success",
        title: "Blog added successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // reset form
      setTitle("");
      setAuthor("");
      setTags("");
      setContent("");
      setThumbPreview(null);
      if (fileRef.current) fileRef.current.value = null;
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
    setThumbPreview(null);
    if (fileRef.current) fileRef.current.value = null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your thoughts with the world
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <FileText className="w-4 h-4" />
                Blog Title
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your blog post"
              />
            </div>

            {/* Author Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <User className="w-4 h-4" />
                Author Name
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your name or pen name"
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., technology, web development, AI"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Separate multiple tags with commas
              </p>
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <AlignLeft className="w-4 h-4" />
                Content
                <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-transparent outline-none transition-all resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here... Share your insights, ideas, and stories."
              />
            </div>

            {/* Thumbnail Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Image className="w-4 h-4" />
                Thumbnail Image
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
              </label>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="flex-1 w-full">
                  <label className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-700/50">
                    <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {thumbPreview ? "Change Image" : "Upload Image"}
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {thumbPreview && (
                  <div className="relative group">
                    <img
                      src={thumbPreview}
                      alt="Thumbnail preview"
                      className="w-full sm:w-40 h-28 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setThumbPreview(null);
                        if (fileRef.current) fileRef.current.value = null;
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                Publish Blog
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Fields marked with <span className="text-red-500">*</span> are required
          </p>
        </div>
      </div>
    </div>
  );
}