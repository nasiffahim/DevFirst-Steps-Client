"use client";

import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";

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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {user} =useAuth();
  const userEmail=user?.email;

  function handleThumbChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setThumbPreview(ev.target.result);
    reader.readAsDataURL(file);
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
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving the project.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow">
      <h2 className="text-2xl text-center font-bold mb-4">Add New Project</h2>

      {error && <div className="text-red-600 mb-3">{error}</div>}
      {success && <div className="text-green-600 mb-3">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name + language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Project Name *</label>
            <input
              className="mt-1 block w-full rounded-md border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Beginner ToDo App"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Language *</label>
            <input
              className="mt-1 block w-full rounded-md border px-3 py-2"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="JavaScript, Python..."
            />
          </div>
        </div>

        {/* difficulty + contributors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Difficulty</label>
            <select
              className="mt-1 block w-full rounded-md border px-3 py-2"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Contributors (approx.)
            </label>
            <input
              type="number"
              min="0"
              className="mt-1 block w-full rounded-md border px-3 py-2"
              value={contributors}
              onChange={(e) => setContributors(e.target.value)}
            />
          </div>
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

        {/* description */}
        <div>
          <label className="block text-sm font-medium">Short Description</label>
          <textarea
            className="mt-1 block w-full rounded-md border px-3 py-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="One paragraph about the project"
          />
        </div>

        {/* repo url */}
        <div>
          <label className="block text-sm font-medium">Repository URL *</label>
          <input
            className="mt-1 block w-full rounded-md border px-3 py-2"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
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
            className=" bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 cursor-pointer"
          >
            Save Project
          </button>
          <button
            type="button"
            onClick={() => {
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
