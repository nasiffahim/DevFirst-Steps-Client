"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import api from "../../../../utils/api";
import { toast } from "react-toastify";
import ImageUpload from "../../../../Components/register/ImageUpload/ImageUpload";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/my-blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const updatedBlog = {
        ...blog,
        thumbnail: blog.thumbnail?.trim() === "" ? null : blog.thumbnail,
      };

      await api.put(`/my-blogs/${id}`, updatedBlog);
      toast.success("Blog updated successfully!");
      router.push("/dashboard/my-blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog!");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Loading blog details...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Edit Blog
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 space-y-6 border border-gray-100"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            value={blog.title || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={blog.author || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            value={blog.tags || ""}
            onChange={handleChange}
            placeholder="e.g. javascript, webdev, nextjs"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={blog.content || ""}
            onChange={handleChange}
            rows="8"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            required
          ></textarea>
        </div>

        {/* Thumbnail Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <ImageUpload
            imageUrl={blog.thumbnail || ""}
            setImageUrl={(url) =>
              setBlog((prev) => ({ ...prev, thumbnail: url }))
            }
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition flex justify-center items-center gap-2"
        >
          {updating && <Loader2 className="w-5 h-5 animate-spin" />}
          {updating ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
