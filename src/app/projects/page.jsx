
"use client"
import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("projects.json")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  return (
   <div className="bg-gradient-to-r min-h-[80vh] from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
     <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">All Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{project.title}</h2>
            <p className="text-gray-700 mt-1">{project.description}</p>
            <div className="mt-2">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="inline-block bg-gray-200 rounded px-2 py-1 text-sm mr-2"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  GitHub
                </a>
              )}
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  className="text-green-500 hover:underline"
                >
                  Live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
   </div>
  );
}
