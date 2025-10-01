"use client"; // Next.js App Router

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import TagSelector from "../../discussion/TagSelector"; // adjust path if needed
import ProtectedPage from "../../../../Components/Protected/ProtectedPage";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
// EditPost
export default function EditPostPage() {
  const router = useRouter();
  const path = usePathname();
  const id = path.split("/").pop(); // /dashboard/mypost/[id]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      content: "",
      status: "active",
    },
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const { user } = useAuth();

  // Fetch the post data
useEffect(() => {
  if (!id) return;
  const fetchPost = async () => {
    try {
      const resp = await axios.get(`http://localhost:5000/api/posts/${id}`);
      const post = resp.data;

      reset({
        title: post?.title || "",
        category: post?.category || "",
        content: post?.preview || "",
        status: post?.status || "active",
      });

      setSelectedTags(post?.tags || []);
    } catch (err) {
      console.error("Error fetching post:", err);
      setErrorMsg("Could not load post data.");
    } finally {
      setLoading(false);
    }
  };

  fetchPost();
}, [id, reset]);


const onSubmit = async (data) => {
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

  try {
   const resp = await axios.patch(
  `http://localhost:5000/edit/post/${id}`,
  payload,
  { headers: { "Content-Type": "application/json" } }
);

    console.log("Post updated:", resp.data);

    Swal.fire({
      title: "✅ Post Updated!",
      text: "Your post has been successfully updated.",
      icon: "success",
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Go to Post",
    }).then(() => {
      router.push(`/platform/community-post`);
    });
  } catch (err) {
    console.error("Failed to update post:", err);
    Swal.fire({
      title: "⚠️ Update Failed",
      text: "Something went wrong. Please try again.",
      icon: "error",
      confirmButtonColor: "#dc2626",
    });
    setErrorMsg("Update failed. Try again.");
  }
};



  if (loading) return <div>Loading post data...</div>;
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <ProtectedPage>
      <div className="min-h-screen text-black flex justify-center items-start p-6">
        <div className="rounded-3xl shadow-xl w-full max-w-3xl p-8 space-y-6">
          <h1 className="text-3xl font-bold mb-4">Edit Post</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter discussion title"
                defaultValue=""
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input
                type="text"
                {...register("category", { required: "Category is required" })}
                placeholder="Enter discussion category"
                defaultValue=""
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                {...register("content", { required: "Content is required" })}
                placeholder="Write your post here..."
                rows={6}
                defaultValue=""
                className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
              />
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* Tag Selector */}
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />

            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                {...register("status")}
                defaultValue="active"
                className="border border-gray-300 rounded-2xl px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                <option value="active">🔵 Active</option>
                <option value="solved">✅ Solved</option>
                <option value="featured">⭐ Featured</option>
                <option value="hot">🔥 Hot</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition text-lg"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedPage>
  );
}
