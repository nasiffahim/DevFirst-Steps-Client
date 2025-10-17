"use client";

import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";
import { useRouter } from "next/navigation";
import {
  Save,
  RotateCcw,
  Code,
  Tag,
  Users,
  Link2,
  Image,
  FileText,
  Layers,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
} from "lucide-react";

export default function AddProjectForm() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [contributors, setContributors] = useState("");
  const [thumbPreview, setThumbPreview] = useState(null);
  const fileRef = useRef(null);
  const router = useRouter();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user } = useAuth();

  const userEmail = user?.email;

  function handleThumbChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setThumbPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  function removeThumbnail() {
    setThumbPreview(null);
    if (fileRef.current) fileRef.current.value = null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) return setError("Project name is required.");
    if (!language.trim()) return setError("Language is required.");
    if (!repoUrl.trim()) return setError("Repository URL is required.");

    const project = {
      id: Date.now().toString(),
      name: name.trim(),
      language: language.trim(),
      difficulty,
      tags,
      description: description.trim(),
      repoUrl: repoUrl.trim(),
      contributors: Number(contributors) || 0,
      thumbnail: thumbPreview || null,
      createdAt: new Date().toISOString(),
      AuthorEmail: user?.email,
      AuthorName: user?.displayName,
      AuthorPhoto: user?.photoURL,
    };

    console.log(project, "Form Data Submitted:");

    try {
      await api.post("/add-projects", project);
      
      if (userEmail) {
        await api.post("/update-activity", {
          email: userEmail,
          activityType: "project-addition",
        });
      }

      Swal.fire({
        icon: "success",
        title: "Project added successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // reset
      setName("");
      setLanguage("");
      setDifficulty("Easy");
      setTags("");
      setDescription("");
      setRepoUrl("");
      setContributors("");
      setThumbPreview(null);

      if (fileRef.current) fileRef.current.value = null;
      router.push("/dashboard/my-projects");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the project.");
    }
  }

  function handleReset() {
    setName("");
    setLanguage("");
    setDifficulty("Easy");
    setTags("");
    setDescription("");
    setRepoUrl("");
    setContributors("");
    setThumbPreview(null);
    if (fileRef.current) fileRef.current.value = null;
    setError("");
    setSuccess("");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex justify-center items-center gap-3">
            <Layers className="w-7 h-7" />
            Add New Project
          </h2>
          <p className="text-gray-300 text-sm text-center mt-2">
            Share your project with the community and collaborate with
            developers
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-8 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 dark:text-green-300 text-sm">
              {success}
            </p>
          </div>
        )}

        {/* Form */}
        <div className="p-8 space-y-6">
          {/* Project Name + Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Project Name *
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-700 focus:border-transparent transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Beginner ToDo App"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Language *
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-700 focus:border-transparent transition-all"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="JavaScript, Python..."
              />
            </div>
          </div>

          {/* Difficulty + Contributors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Difficulty Level
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-700 focus:border-transparent transition-all"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contributors (approx.)
              </label>
              <input
                type="number"
                min="0"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-700 focus:border-transparent transition-all"
                value={contributors}
                onChange={(e) => setContributors(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-700 focus:border-transparent transition-all"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="web, ai, machine-learning (comma separated)"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Short Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-700 focus:border-transparent transition-all resize-none"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="One paragraph about the project and what makes it special..."
            />
          </div>

          {/* Repository URL */}
          <div>
            <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Repository URL *
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-700 focus:border-transparent transition-all"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Thumbnail (optional)
            </label>

            {!thumbPreview ? (
              <div className="relative">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbChange}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <Upload className="w-10 h-10 text-gray-400 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={thumbPreview}
                  alt="preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={handleSubmit}
              className="cursor-pointer flex items-center gap-2 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Save className="w-4 h-4" />
              Save Project
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="cursor-pointer flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 border border-gray-300 dark:border-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
