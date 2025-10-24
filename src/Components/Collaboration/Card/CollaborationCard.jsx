import React from "react";
import { useRouter } from "next/navigation";
import { Users, User, Briefcase, Award } from "lucide-react";

export default function CollaborationCard({ collaboration }) {
  const {
    _id,
    title,
    owner,
    description,
    skills,
    teamSize,
    members
  } = collaboration || {};

  const router = useRouter();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 group overflow-hidden flex flex-col h-full">
      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title Section */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {title}
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span className="font-medium">Project Lead:</span>
              <span>{owner}</span>
            </div>
          </div>

          {/* Team Status Badge */}
          <div className="flex flex-col items-center gap-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-lg flex-shrink-0">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">
              {members.length}/{teamSize}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Team</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
            {description?.length > 120 ? description.slice(0, 120) + "..." : description}
          </p>
        </div>

        {/* Skills Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Required Skills
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills?.length > 0 ? (
              skills.slice(0, 5).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">No skills specified</span>
            )}
            {skills?.length > 5 && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 font-medium">
                +{skills.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => router.push(`/collaboration/ProjectDetails/${_id}`)}
            className="w-full px-5 py-2.5 bg-blue-600 dark:bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 dark:hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}