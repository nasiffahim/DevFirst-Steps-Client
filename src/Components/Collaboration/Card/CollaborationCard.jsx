"use client";

import React from "react";
import { Users, User, Code2 } from "lucide-react";
import Link from "next/link";

export default function CollaborationCard({ collaboration }) {
  const {
    _id,
    title,
    owner,
    description,
    skills = [],
    currentMembers = 1,
    teamSizeGoal = 5,
  } = collaboration;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 group overflow-hidden">
      {/* Card Header */}
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
            <User className="w-4 h-4" /> {owner || "Unknown"}
          </p>
        </div>

        {/* Member Count */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300">
          <Users className="w-4 h-4" />
          <span>
            {currentMembers}/{teamSizeGoal}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="px-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
        {description?.length > 100 ? description.slice(0, 100) + "..." : description}
      </p>

      {/* Skills */}
      <div className="px-6 py-3 flex flex-wrap gap-2">
        {skills?.length > 0 ? (
          skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-gray-400 italic">No skills listed</span>
        )}
      </div>

      {/* Footer / Join Button */}
      <div className="px-6 pb-6 pt-2 flex justify-end ">
        

        <Link
          href={`/Collaboration/ProjectDetails/${_id}`}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
