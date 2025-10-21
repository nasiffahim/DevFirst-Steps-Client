"use client";
import React, { useState } from "react";
import axios from "axios";
import TagSelector from "../dashboard/discussion/TagSelector"; // Import your reusable TagSelector
import { Loader2, Github } from "lucide-react";

const ProjectSuggestions = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProjects([]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/get-projects", {
        skills: selectedTags.join(","),
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      setError("⚠️ Failed to fetch project suggestions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-12">
      
      {/* Skills Selector Form */}
      <div className="w-full max-w-7xl mb-12">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl p-8 shadow-xl flex flex-col gap-6"
        >
          <TagSelector
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
          <button
            type="submit"
            disabled={loading || selectedTags.length === 0}
            className="bg-gradient-to-r  to-purple-700 p-4 rounded-xl text-xl font-semibold flex items-center justify-center transition-all duration-300 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin mr-2 w-5 h-5" />}
            {loading ? "Generating..." : " Project Ideas"}
          </button>
        </form>
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>

      {/* Projects Section */}
      <div className="w-full max-w-6xl flex-1">
        {loading && (
          <div className="text-center text-gray-400 text-lg mt-8">
            Loading projects...
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, index) => (
              <div
                key={index}
                className="bg-gray-800/80 border border-gray-700 rounded-2xl p-6 hover:shadow-2xl hover:border-purple-500 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-white line-clamp-1">
                    {p.name}
                  </h2>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    title="View on GitHub"
                  >
                    <Github className="w-5 h-5 text-gray-300" />
                  </a>
                </div>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {p.description || "No description available"}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>⭐ {p.stars || 0}</span>
                  <span>🧩 {p.language || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && !error && (
          <p className="text-gray-500 text-center text-lg mt-10">
            Select your skills above to see AI-powered project suggestions!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectSuggestions;
