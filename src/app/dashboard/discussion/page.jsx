"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TagSelector from "./TagSelector";
import useAuth from "../../hooks/useAuth";
import ProtectedPage from "../../../Components/Protected/ProtectedPage";
import ImageUpload from "../../../Components/register/ImageUpload/ImageUpload";
import axios from "axios";

export default function CommunityCreate() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imageUrl, setImageUrl] = useState(null); // Stores image URL
  const [selectedTags, setSelectedTags] = useState([]); // Stores selected tags
  const { user } = useAuth(); // User data from auth hook

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        preview: data.content.slice(0, 100), // Optional: generate preview from content
        category: data.category,
        content: data.content,
        status: data.status || "active",
        tags: selectedTags, // Send selected tags
        author: {
          name: user?.displayName || "Anonymous",
          avatar: user?.photoURL || "👤",
        },
        email: user?.email,
      };

      console.log(payload); // Log the payload to inspect

      // Send the post request with JSON, not multipart/form-data
      const response = await axios.post("http://localhost:5000/create_post", payload, {
        headers: { "Content-Type": "application/json" }, // Correct header for JSON
      });

      console.log("Discussion created:", response.data);

      // Reset form fields after submission
      // reset();
      // setSelectedTags([]);
      // setImageUrl(null);
    } catch (error) {
      console.error("Failed to create discussion:", error);
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen  text-black flex justify-center items-start p-6">
        <div className=" rounded-3xl shadow-xl w-full max-w-3xl p-8 space-y-6">
          <h1 className="text-3xl font-bold  mb-4">Create a Post</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter discussion title"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                {...register("category", { required: "Category is required" })}
                placeholder="Enter discussion category"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-1">Write your discussion detail</label>
              <textarea
                {...register("content", { required: "Content is required" })}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
              />
              {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>}
            </div>

            {/* Image Upload
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-gray-700">Upload Image</label>
              <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
              {imageUrl && (
                <div className="mt-3 w-full flex justify-center">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-60 w-auto rounded-lg object-contain border"
                  />
                </div>
              )}
            </div> */}

            {/* Tag Selector */}
            <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

            {/* Status Dropdown */}
            <div>
              <select
                {...register("status")}
                className="border border-gray-300 rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="active">🔵 Active</option>
                <option value="solved">✅ Solved</option>
                <option value="featured">⭐ Featured</option>
                <option value="hot">🔥 Hot</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition text-lg"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedPage>
  );
}
