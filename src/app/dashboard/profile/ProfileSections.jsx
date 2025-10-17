import React from "react";
import { Briefcase, Wrench, FileText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

/* ---------------- EXPERIENCE SECTION ---------------- */
export function ExperienceSection({ experienceList }) {
  if (!experienceList || experienceList.length === 0) return null;

  return (
    <div className="border rounded-2xl bg-white dark:bg-gray-900 shadow-md max-w-2xl mx-auto mt-8">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 uppercase text-sm tracking-wide">
          Work Experience
        </h2>
      </div>

      {/* Experience Details */}
      <div className="p-6 space-y-4">
        {experienceList.map((exp, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md">
              <Briefcase className="w-6 h-6 text-gray-500 dark:text-gray-300" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{exp.company}</p>
              {exp.description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{exp.description}</p>
              )}
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {exp.start} - {exp.ongoing ? "Present" : exp.end}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SKILLS SECTION ---------------- */
export function SkillsSection({ skillsList }) {
  if (!skillsList || skillsList.length === 0) return null;

  return (
    <div className="border rounded-2xl bg-white dark:bg-gray-900 shadow-md max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 uppercase text-sm tracking-wide">
          Skills / Technologies
        </h2>
      </div>

      <div className="p-6 flex flex-wrap gap-3">
        {skillsList.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- LINKS SECTION ---------------- */
export function LinksSection({ linkedin, github, resume }) {
  return (
    <div className="border rounded-2xl bg-white dark:bg-gray-900 shadow-md max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 uppercase text-sm tracking-wide">
          Links
        </h2>
      </div>

      <div className="p-6 space-y-3">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <FaLinkedin className="w-5 h-5" /> LinkedIn
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:underline"
          >
            <FaGithub className="w-5 h-5" /> GitHub
          </a>
        )}
        {resume && (
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-gray-800 dark:text-gray-200 hover:underline"
          >
            <FileText className="w-5 h-5" /> Resume
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------- EDUCATION SECTION ---------------- */
export function EducationSection({ educationList }) {
  if (!Array.isArray(educationList) || educationList.length === 0) return null;

  return (
    <div className="border rounded-2xl bg-white dark:bg-gray-900 shadow-md max-w-2xl mx-auto mt-8">
      <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold text-gray-800 dark:text-gray-200 uppercase text-sm tracking-wide">
          Education
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {educationList.map((edu, idx) => (
          <div key={idx} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-500 dark:text-gray-300"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-6-6h12" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {edu.university}{" "}
                {edu.location && <span className="text-gray-600 dark:text-gray-400">{edu.location}</span>}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{edu.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
