import React from "react";
import { Plus } from "lucide-react";

export default function EducationSection({ educationList }) {
  return (
    <div className="border rounded-lg bg-white shadow-sm max-w-2xl mx-auto mt-8">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold text-gray-800 uppercase text-sm tracking-wide">
          Education
        </h2>
     
      </div>

      {/* Education Details */}
      <div className="p-4">
        {educationList.map((edu, idx) => (
          <div key={idx} className="flex items-start gap-3 mb-4">
            {/* Icon */}
            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v12m-6-6h12"
                />
              </svg>
            </div>

            {/* Text */}
            <div>
              <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
              <p className="text-gray-700">
                {edu.university},{" "}
                <span className="text-gray-600">{edu.location}</span>
              </p>
              <p className="text-gray-500 text-sm mt-1">{edu.year}</p>
            </div>
          </div>
        ))}

        {/* Show More */}
        <button className="text-sm text-gray-600 mt-3 hover:underline">
          Show More Education (2)
        </button>
      </div>
    </div>
  );
}
