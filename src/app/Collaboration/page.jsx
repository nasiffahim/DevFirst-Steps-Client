"use client";

import React, { useState } from "react";
import CollaborationCard from "../../Components/Collaboration/Card/CollaborationCard";
import { Search } from "lucide-react";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const dummyData = [
    {
      _id: "1",
      title: "AI Task Manager",
      owner: "Shohel",
      description:
        "An AI-driven productivity tool to manage your daily tasks efficiently.",
      skills: ["React", "Node.js", "MongoDB", "Tailwind"],
      currentMembers: 3,
      teamSizeGoal: 5,
    },
    {
      _id: "2",
      title: "Crypto Dashboard",
      owner: "Shohel",
      description: "Track crypto prices in real-time with advanced charts.",
      skills: ["React", "Next.js", "Chart.js", "Tailwind"],
      currentMembers: 2,
      teamSizeGoal: 4,
    },
    {
      _id: "3",
      title: "Blog Platform",
      owner: "Shohel",
      description: "A modern blogging platform for writers and readers.",
      skills: ["Next.js", "Node.js", "MongoDB", "Tailwind"],
      currentMembers: 4,
      teamSizeGoal: 6,
    },
    {
      _id: "4",
      title: "E-commerce App",
      owner: "Shohel",
      description: "A full-featured e-commerce app with payment integration.",
      skills: ["React", "Redux", "Node.js", "Stripe"],
      currentMembers: 5,
      teamSizeGoal: 8,
    },
  ];

  // Filter collaborations by technology (case-insensitive)
  const filteredData = dummyData.filter((collab) =>
    collab.skills.some((skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-6 relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 dark:text-gray-500">
          <Search className="w-5 h-5" />
        </span>

        <input
          type="text"
          placeholder="Search projects by technology..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((collab) => (
            <CollaborationCard key={collab._id} collaboration={collab} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-600 dark:text-gray-400">
            No projects found for "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
