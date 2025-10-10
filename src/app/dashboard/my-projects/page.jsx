"use client";

import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import {
  Code2,
  Calendar,
  Users,
  Tag,
  ExternalLink,
  Github,
  Trophy,
  Loader2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
} from "lucide-react";
import api from "../../../utils/api";
import useAuth from "../../../app/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleDelete = useCallback((id) => {
    if (!id) return;

    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/my-projects/${id}`);
          setProjects((prev) => prev.filter((p) => p._id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Your Project has been removed.",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Delete error:", err);
          Swal.fire({
            icon: "error",
            title: "Failed!",
            text: "Something went wrong. Try again.",
          });
        }
      }
    });
  }, []);

  console.log("user data:", user);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/my-projects");
      setProjects(response.data);
    } catch (err) {
      setError("Failed to fetch projects. Please try again.");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLanguageIcon = (language) => {
    switch (language?.toLowerCase()) {
      case "java":
        return "☕";
      case "javascript":
        return "🟨";
      case "python":
        return "🐍";
      case "react":
        return "⚛️";
      default:
        return "💻";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-gray-900 dark:text-gray-300 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Loading your amazing projects...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">
              {error}
            </p>
            <button
              onClick={fetchProjects}
              className="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 dark:bg-gray-800 rounded-full mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Projects
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Showcasing my development journey
          </p>
          <div className="flex items-center justify-center mt-4">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {projects.length} Projects Built
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Start building something awesome!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                // ✅ Added click redirect
                className=" bg-white dark:bg-gray-900 rounded-2xl shadow-lg dark:shadow-gray-900/50 hover:shadow-2xl dark:hover:shadow-gray-900/70 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800"
              >
                {/* Project Header */}
                <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getLanguageIcon(project.language)}
                      </span>
                      <div>
                        <h3 className="font-bold text-lg truncate">
                          {project.name}
                        </h3>
                        <p className="text-gray-300 dark:text-gray-400 text-sm capitalize">
                          {project.language}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                        project.difficulty
                      )} bg-white dark:bg-gray-900`}
                    >
                      {project.difficulty}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h2>Author Name : {project.AuthorName}</h2>
                  <h2>Author Email : {project.AuthorEmail}</h2>
                  <h2 className="flex items-center gap-2">
                    Author Photo :{" "}
                    <img
                      className=" w-12 rounded-full"
                      src={project.AuthorPhoto}
                      alt=""
                    />
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && (
                    <div className="flex items-center mb-4">
                      <Tag className="w-4 h-4 text-gray-400 dark:text-gray-600 mr-2" />
                      <div className="flex flex-wrap gap-1">
                        {project.tags.split(",").map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>
                        {project.contributors} contributor
                        {project.contributors !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {/* <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </a> */}

                    <div className="flex gap-1">
                      {/* Edit Button  */}
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
                        <Pencil className="w-4 h-4"></Pencil> Edit
                      </button>
                      {/* Delete Button  */}
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4"></Trash2>
                        Delete
                      </button>
                    </div>
                    {/* Details Button  */}
                    <Link
                      className="inline-flex items-center justify-center px-4 py-2 border-2 border-gray-900 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                      href={`/dashboard/my-projects/${project._id}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
