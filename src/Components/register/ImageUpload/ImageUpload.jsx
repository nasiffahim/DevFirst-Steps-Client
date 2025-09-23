"use client";
import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function ImageUpload({ setImageUrl, imageUrl }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=5a47aa909312567fa72e3c3f9a5f6c6d`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        const uploadedUrl = data.data.url;
        setImageUrl(uploadedUrl); // ✅ update parent state
      } else {
        console.error("Upload failed:", data);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Profile Image</label>
      <div className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition border-gray-300">
        {/* Full area clickable input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Uploading status */}
        {loading && <p className="text-sm text-gray-500">Uploading...</p>}

        {/* Image preview */}
        {!loading && imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        ) : (
          !loading && (
            <div className="flex flex-col items-center pointer-events-none">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-gray-600 text-sm">
                Drag & drop or click to choose an image
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
