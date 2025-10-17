"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Search, Award, Briefcase, Clock, Star, Mail, User } from "lucide-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Link from "next/link";

export default function FindMentor() {
  const [mentors, setMentors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  console.log("mentors data: ", mentors);

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
      const username = m.username?.toLowerCase() || "";
      const expertise = m.expertise?.toLowerCase() || "";
      const term = search.toLowerCase();

      return username.includes(term) || expertise.includes(term);
    });

    setFiltered(filteredMentors);
  }, [search, mentors]);

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case "gold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "silver":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case "bronze":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "none":
        return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            Find Your Perfect Mentor
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
            Connect with experienced mentors who can guide you on your learning journey
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or expertise..."
              className="w-full pl-12 pr-4 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mentor) => (
            <div
              key={mentor._id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {/* Badge - Always show */}
              <div className="flex justify-end mb-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(
                    mentor.badge || "none"
                  )}`}
                >
                  <Award className="w-3 h-3" />
                  {mentor.badge || "None"}
                </span>
              </div>

              {/* Avatar */}
              <div className="relative mb-4">
                {mentor.image || mentor.photo ? (
                  <img
                    src={mentor.image || mentor.photo}
                    alt={mentor.username}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-gray-100 dark:border-gray-700 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 mx-auto border-4 border-gray-100 dark:border-gray-700 shadow-md flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                {/* Points - Always show */}
                <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  {mentor.points || 0}
                </div>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100 mb-1 capitalize">
                {mentor.username}
              </h3>

              {/* Email */}
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-4">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-[200px]">{mentor.email}</span>
              </div>

              {/* Expertise */}
              <div className="mb-4">
                <div className="inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm font-medium">
                  {mentor.expertise || "No skills added"}
                </div>
              </div>

              {/* Info Grid */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-medium">Experience:</span>
                  <span>{mentor.experience} years</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Available:</span>
                  <span className="capitalize">{mentor.availability}</span>
                </div>

                {mentor.work && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Briefcase className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-medium">Work:</span>
                      <span className="ml-1">{mentor.work}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* View Profile Button */}
              <Link
                href={`/dashboard/find-mentor/${mentor._id}`}
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filtered.length === 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No mentors found
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}