"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../utils/api";

export default function NewCollaborationForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubRepo: "",
    skills: [],
    projectType: "",
    teamSize: "",
    collaborationType: "",
    contactPreference: "",
  });

  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);

  // Common tech skills for suggestions
  const skillSuggestions = [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Firebase",
    "TypeScript",
    "JavaScript",
    "Python",
    "Django",
    "Flask",
    "Tailwind CSS",
    "Bootstrap",
    "HTML",
    "CSS",
    "Git",
    "GitHub",
    "PostgreSQL",
    "MySQL",
    "Prisma",
    "GraphQL",
    "Redux",
    "Socket.io",
    "REST API",
    "Docker",
    "AWS",
  ];

  // Handle input change and filter suggestions
  const handleSkillInput = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    if (value.trim()) {
      const filtered = skillSuggestions.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !formData.skills.includes(skill)
      );
      setFilteredSkills(filtered.slice(0, 6)); // Show up to 6 matches
    } else {
      setFilteredSkills([]);
    }
  };

  // Add a skill manually or from suggestion
  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput("");
    setFilteredSkills([]);
  };

  const removeSkill = (i) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.info("🚧 This feature is coming soon!");
    console.log(formData)
    setLoading(false);
    // try {
    //   await api.post("/collaboration/create", formData);
    //   toast.success("🎉 Collaboration Created Successfully!");
    //   setFormData({
    //     title: "",
    //     description: "",
    //     githubRepo: "",
    //     skills: [],
    //     projectType: "",
    //     teamSize: "",
    //     collaborationType: "",
    //     contactPreference: "",
    //   });
    // } catch (err) {
    //   toast.error("Something went wrong. Please try again!");
    //   console.error(err);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <PlusCircle className="w-6 h-6 text-blue-600" />
        Start a New Collaboration
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Project Title */}
        <InputField
          label="Project Title"
          placeholder="Enter project name"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Short Description */}
        <TextAreaField
          label="Short Description"
          placeholder="Briefly describe your project"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* GitHub Repo */}
        <InputField
          label="GitHub Repo (optional)"
          placeholder="https://github.com/username/repo"
          type="url"
          value={formData.githubRepo}
          onChange={(e) =>
            setFormData({ ...formData, githubRepo: e.target.value })
          }
        />

        {/* Skills Needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tech Stack / Skills Needed
          </label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 p-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {formData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="ml-2 text-blue-600 dark:text-blue-300 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={handleSkillInput}
                onKeyDown={(e) => {
                  if (["Enter", ",", "Comma"].includes(e.key) && skillInput.trim()) {
                    e.preventDefault();
                    addSkill(skillInput.trim());
                  }
                }}
                className="flex-1 bg-transparent outline-none min-w-[150px]"
                placeholder="Type a skill..."
              />
            </div>

            {/* Suggestion Dropdown */}
            {filteredSkills.length > 0 && (
              <ul className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 w-full max-h-40 overflow-y-auto">
                {filteredSkills.map((skill, idx) => (
                  <li
                    key={idx}
                    onClick={() => addSkill(skill)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or select from suggestions to add skills
          </p>
        </div>

        {/* Project Type */}
        <SelectField
          label="Project Type"
          required
          options={["Open Source", "Startup", "Hackathon", "Learning Project"]}
          value={formData.projectType}
          onChange={(e) =>
            setFormData({ ...formData, projectType: e.target.value })
          }
        />

        {/* Team Size */}
        <InputField
          label="Team Size Goal"
          type="number"
          placeholder="e.g. 5"
          min="1"
          value={formData.teamSize}
          onChange={(e) =>
            setFormData({ ...formData, teamSize: e.target.value })
          }
        />

        {/* Collaboration Type */}
        <SelectField
          label="Collaboration Type"
          required
          options={["Remote", "Async", "Real-time"]}
          value={formData.collaborationType}
          onChange={(e) =>
            setFormData({ ...formData, collaborationType: e.target.value })
          }
        />

        {/* Contact Preference */}
        <SelectField
          label="Contact Preference"
          required
          options={["Chat", "Discord", "Email"]}
          value={formData.contactPreference}
          onChange={(e) =>
            setFormData({ ...formData, contactPreference: e.target.value })
          }
        />

        {/* Submit */}
        <div className="pt-4">
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlusCircle className="w-5 h-5" />
                Create Collaboration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ——— Reusable Input Components ——— */
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <textarea
      {...props}
      rows="3"
      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
    ></textarea>
  </div>
);

const SelectField = ({ label, options = [], ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <select
      {...props}
      className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt.toLowerCase()}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
