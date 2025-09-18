"use client"
import { useEffect, useState } from "react";

export default function ProjectList({ limit }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/projects.json") // fetch from public folder
      .then((res) => res.json())
      .then((data) => {
        if (limit) {
          // take last N projects if limit is provided
          setProjects(data.slice(-limit).reverse());
        } else {
          setProjects(data);
        }
      })
      .catch((err) => console.error(err));
  }, [limit]);

  return (
    <div className="bg-gradient-to-r min-h-[80vh] from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ">
        <div className=" max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project._id}
          className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="text-xl font-semibold mt-2">{project.title}</h2>
          <p className="text-gray-700 mt-1">{project.description}</p>
          <div className="mt-2">
            <button className="btn mr-2 bg-black text-white p-2 rounded-xl">Details</button>
          <button className="btn bg-black mr-2 text-white p-2 rounded-xl">Live</button>
          <button className="btn bg-black  text-white p-2 rounded-xl">Github</button>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}
