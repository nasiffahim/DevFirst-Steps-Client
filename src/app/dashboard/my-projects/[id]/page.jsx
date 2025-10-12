"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Code,
  Tag,
  Layers,
  Link2,
  Calendar,
  User,
} from "lucide-react";
import api from "../../../../utils/api";

export default function UserProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch project details
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await api.get(`/my-projects/${id}`); // Make sure endpoint is correct
        console.log("Fetched project:", res.data);
        setProject(res.data);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Loading project details...
      </div>
    );
  }

  // ✅ Not found state
  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Project not found.
      </div>
    );
  }

  // ✅ Render project details
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-8 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Thumbnail */}
      {project.thumbnail ? (
        <img
          src={project.thumbnail}
          alt={project.name}
          className="w-full h-64 object-cover rounded-2xl shadow-md mb-8"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-2xl mb-8 text-gray-400 text-lg">
          No image available
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">
        {project.name}
      </h1>

      {/* Metadata */}
      <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-2">
          <Code className="w-4 h-4" /> {project.language || "N/A"}
        </span>
        <span className="flex items-center gap-2">
          <Layers className="w-4 h-4" /> {project.difficulty || "N/A"}
        </span>
        <span className="flex items-center gap-2">
          <Tag className="w-4 h-4" /> {project.tags || "N/A"}
        </span>
        <span className="flex items-center gap-2">
          <Users className="w-4 h-4" /> Contributors: {project.contributors}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed mb-8">
        {project.description}
      </p>

      {/* Repo Link */}
      {project.repoUrl && (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Link2 className="w-4 h-4" />
          View Repository
        </a>
      )}
    </div>
  );
}
