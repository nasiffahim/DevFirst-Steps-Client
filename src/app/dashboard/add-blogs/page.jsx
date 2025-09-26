"use client";

import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import api from "../../../utils/api";

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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow">
      <h2 className="text-3xl text-center font-bold mb-4">Add New Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* title */}
        <div>
          <label className="block text-sm font-medium">Title </label>
          <input
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog title"
          />
        </div>
        {/* Author name */}
        <div>
          <label className="block text-sm font-medium">Author </label>
          <input
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
          />
        </div>

        {/* tags */}
        <div>
          <label className="block text-sm font-medium">Tags</label>

          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border px-3 py-2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Type tag and press Add (eg: web, ai)"
            />
          </div>
        </div>

        {/* content */}
        <div>
          <label className="block text-sm font-medium">Content *</label>
          <textarea
            className="mt-1 block w-full rounded-md border px-3 py-2"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
          />
        </div>

        {/* thumbnail */}
        <div>
          <label className="block text-sm font-medium">
            Thumbnail (optional)
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleThumbChange}
            className="mt-1"
          />
          {thumbPreview && (
            <img
              src={thumbPreview}
              alt="preview"
              className="mt-3 w-36 h-24 object-cover rounded-md border"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700  hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            Save Blog
          </button>
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setAuthor("");
              setTags("");

              setContent("");
              setThumbPreview(null);
              if (fileRef.current) fileRef.current.value = null;
            }}
            className="px-4 py-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 rounded-md border cursor-pointer"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
