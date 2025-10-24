"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectDetails from "./ProjectDetails";

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
        const res = await fetch(`http://localhost:5000/collaboration/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch project data");
        }
        const data = await res.json();
        setProject(data);
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
