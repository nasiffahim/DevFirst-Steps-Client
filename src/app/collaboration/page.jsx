"use client";

import React, { useState, useEffect } from "react";
import CollaborationCard from "../../Components/Collaboration/Card/CollaborationCard";
import { Search } from "lucide-react";
import api from "../../utils/api";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch collaborations from API
  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        const res = await api.get("/collaboration/all");
        setCollaborations(res.data || []);
      } catch (err) {
        console.error("Error fetching collaborations:", err);
        setError("Failed to load collaborations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  // Filter collaborations by search term (skills or title)
  const filteredData = collaborations.filter((collab) => {
    const term = searchTerm.toLowerCase();
    return (
      collab.title?.toLowerCase().includes(term) ||
      collab.description?.toLowerCase().includes(term) ||
      collab.skills?.some((skill) => skill.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-6 relative">
        <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 dark:text-gray-500">
          <Search className="w-5 h-5" />
        </span>

        <input
          type="text"
          placeholder="Search projects by name or technology..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-10">
          <div className="w-8 h-8 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3">Loading collaborations...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <p className="text-center text-red-500 mt-6">{error}</p>
      )}

      {/* Projects Grid */}
      {!loading && !error && (
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
      )}
    </div>
  );
};

export default Page;
