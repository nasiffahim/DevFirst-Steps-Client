"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TagSelector from "./TagSelector"
import axios from "axios";
import useAuth from "../hooks/useAuth";
import ProtectedPage from "../../Components/Protected/ProtectedPage";


// Main CommunityCreate component
export default function CommunityCreate() {

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const {user}=useAuth()
// submit form
  const handleImageChange = (e) => {

    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
    else setImagePreview(null);
  };
    // submit  form
const onSubmit = async (data) => {
  try {
   
 const payload = {
  ...data,email: user?.email || user?.providerData[0]?.email , // spread all other form fields
  status: data?.status || "active",         // default status if not set
  tags: JSON.stringify(selectedTags),      // convert tags array to JSON string
};

// if (data?.image && data.image.length > 0) {
//   payload?.image = data.image[0]; // add File object to payload
// }


console.log(payload);


// send payload to API // create post end point
    const response = await axios.post("http://localhost:5000/create_post",payload, {
     
    });
     console.log("Discussion created:", response.data);
    data.reset();
    setSelectedTags([]);
    setImagePreview(null);
  } catch (error) {
    console.error("Failed to create discussion:", error);
  }
};


  return (
     <ProtectedPage>
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6">
      {/* Full-width card */}
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Create a Post</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: "Title is required" })}
              placeholder="Enter discussion title"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div> 
         
         
         
          {/* Content */}

 <label className="block text-sm font-medium mb-1">
            Write your discussion detail  
            </label>
          <div>
            <textarea
              {...register("content", { required: "Content is required" })}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div className="flex flex-col">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                         file:py-2 file:px-4 file:rounded-full
                         file:border-0 file:bg-blue-600 file:text-white
                         hover:file:bg-blue-700 transition"
            />
            {imagePreview && (
              <div className="mt-3 w-full flex justify-center">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-60 w-auto rounded-lg object-contain border"
                />
              </div>
            )}
          </div>

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

