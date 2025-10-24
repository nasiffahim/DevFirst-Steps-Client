"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectDetails from "./ProjectDetails";
import api from "../../../../utils/api";

const Page = () => {
  const { id } = useParams(); // get project id from route
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(project)

  useEffect(() => {
  if (!id) return;

  const fetchProject = async () => {
    try {
      const res = await api.get(`/collaboration/${id}`);
      setProject(res.data); // Axios automatically parses JSON
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  fetchProject();
}, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        Loading project details...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  if (!project)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        No project found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <ProjectDetails project={project} />
    </div>
  );
};

export default Page;
