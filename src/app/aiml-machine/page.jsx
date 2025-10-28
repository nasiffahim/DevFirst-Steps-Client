"use client";
import React, { useEffect, useState } from "react";

export default function AiMlPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = "ai-ml"; // fixed category

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/project/git/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch projects");
        setLoading(false);
      });
  }, [category]);

  if (loading) return <p className="text-white p-6">Loading  projects...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl text-yellow-400 font-bold mb-6">{category}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:bg-gray-700 transition-all"
          >
            <h2 className="text-xl font-semibold text-white mb-2">{item.name}</h2>
            <p className="text-gray-300 text-sm">
              {item.description ? item.description.slice(0, 90) + "..." : "No description"}
            </p>
            <a
              href={item.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline text-sm"
            >
              🔗 View Repository
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
