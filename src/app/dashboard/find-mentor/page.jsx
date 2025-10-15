"use client";

import React, { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Loader2, Search } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function FindMentor() {
  const [mentors, setMentors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
   const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axiosSecure.get("/mentors");
        setMentors(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

 useEffect(() => {
  const filteredMentors = mentors.filter((m) => {
    // Use optional chaining and fallback to empty string
    const name = m.name?.toLowerCase() || "";
    const expertise = m.expertise?.toLowerCase() || "";
    const term = search.toLowerCase();

    return name.includes(term) || expertise.includes(term);
  });

  setFiltered(filteredMentors);
}, [search, mentors]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Find a Mentor</h1>

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6 border p-2 rounded-lg">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name or expertise..."
          className="flex-1 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Mentors Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((mentor) => (
          <div
            key={mentor._id}
            className="border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <img
              src={mentor.photo || "/default-avatar.png"}
              alt={mentor.name}
              className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold text-center">{mentor.name}</h3>
            <p className="text-center text-sm text-gray-500">{mentor.expertise}</p>
            <p className="text-center mt-2 text-gray-700">
              Experience: {mentor.experience} years
            </p>
            <div className="text-center mt-4">
              <a
                href={`/mentor/${mentor._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Profile
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center mt-10 text-gray-500">No mentors found.</p>
      )}
    </div>
  );
}
