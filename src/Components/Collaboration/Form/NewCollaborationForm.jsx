"use client";

import { useState } from "react";
import { PlusCircle, Github, Users, Briefcase, MessageSquare, Clock, Mail } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../utils/api";
import useAuth from "../../../app/hooks/useAuth";

export default function NewCollaborationForm() {
  const auth = useAuth();
  const user = auth?.user;

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
  const [githubError, setGithubError] = useState("");

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

  // Validate GitHub URL
  const validateGithubUrl = (url) => {
    if (!url) {
      setGithubError("");
      return true;
    }
    const githubPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
    if (!githubPattern.test(url)) {
      setGithubError("Please enter a valid GitHub repository URL (e.g., https://github.com/username/repo)");
      return false;
    }
    setGithubError("");
    return true;
  };

  // Handle skill input
  const handleSkillInput = (e) => {
    const value = e.target.value;
    setSkillInput(value);
    if (value.trim()) {
      const filtered = skillSuggestions.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !formData.skills.includes(skill)
      );
      setFilteredSkills(filtered.slice(0, 6));
    } else {
      setFilteredSkills([]);
    }
  };

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

  // Validate
  const validateForm = () => {
    const { title, description, projectType, collaborationType, contactPreference, githubRepo } = formData;

    if (!title.trim()) return toast.error("Project title is required.");
    if (!description.trim()) return toast.error("Description is required.");
    if (!projectType) return toast.error("Please select a project type.");
    if (!collaborationType) return toast.error("Please select a collaboration type.");
    if (!contactPreference) return toast.error("Please select a contact preference.");
    if (!user) return toast.error("You must be logged in to create a collaboration.");
    if (githubRepo && !validateGithubUrl(githubRepo)) return false;

    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      ...formData,
      ownerName: user?.name || user?.displayName || "Unknown",
      ownerEmail: user?.email,
      ownerPhoto: user?.photoURL || "",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await api.post("/collaboration/create", payload);
      toast.success("Collaboration Created Successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        githubRepo: "",
        skills: [],
        projectType: "",
        teamSize: "",
        collaborationType: "",
        contactPreference: "",
      });
      setGithubError("");
    } catch (err) {
      toast.error("Something went wrong. Please try again!");
      console.error("Error creating collaboration:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 dark:bg-blue-700 px-8 py-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <PlusCircle className="w-8 h-8" />
            Start a New Collaboration
          </h1>
          <p className="text-blue-100 mt-2">
            Fill in the details to create your collaboration project and find team members
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Project Details Section */}
          <div className="space-y-5">
            <SectionHeader icon={<Briefcase className="w-5 h-5" />} title="Project Details" />
            
            <InputField
              label="Project Title"
              placeholder="e.g., AI-Powered Task Manager"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              icon={<Briefcase className="w-4 h-4" />}
            />

            <TextAreaField
              label="Project Description"
              placeholder="Describe your project goals, vision, and what you're building..."
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div>
              <InputField
                label="GitHub Repository"
                placeholder="https://github.com/username/repository"
                type="url"
                value={formData.githubRepo}
                onChange={(e) => {
                  setFormData({ ...formData, githubRepo: e.target.value });
                  validateGithubUrl(e.target.value);
                }}
                onBlur={(e) => validateGithubUrl(e.target.value)}
                icon={<Github className="w-4 h-4" />}
                optional
              />
              {githubError && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-2 flex items-center gap-1">
                  <span>⚠️</span> {githubError}
                </p>
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-5">
            <SectionHeader icon={<Users className="w-5 h-5" />} title="Tech Stack & Team" />
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Required Skills & Technologies
              </label>
              <div className="relative">
                <div className="flex flex-wrap gap-2 p-3 border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[50px] focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
                  {formData.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="flex items-center bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(i)}
                        className="ml-2 text-blue-600 dark:text-blue-300 hover:text-red-600 dark:hover:text-red-400 font-bold text-lg"
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
                      if (["Enter", ","].includes(e.key) && skillInput.trim()) {
                        e.preventDefault();
                        addSkill(skillInput.trim());
                      }
                    }}
                    className="flex-1 bg-transparent outline-none min-w-[150px] text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="Type or select skills..."
                  />
                </div>

                {filteredSkills.length > 0 && (
                  <ul className="absolute z-10 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl mt-2 w-full max-h-48 overflow-y-auto">
                    {filteredSkills.map((skill, idx) => (
                      <li
                        key={idx}
                        onClick={() => addSkill(skill)}
                        className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 last:border-0 font-medium"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                💡 Press Enter or comma to add, click suggestions to select
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Project Type"
                required
                options={["Open Source", "Startup", "Hackathon", "Learning Project"]}
                value={formData.projectType}
                onChange={(e) =>
                  setFormData({ ...formData, projectType: e.target.value })
                }
                icon={<Briefcase className="w-4 h-4" />}
              />

              <InputField
                label="Target Team Size"
                type="number"
                placeholder="e.g., 5"
                min="1"
                max="50"
                value={formData.teamSize}
                onChange={(e) =>
                  setFormData({ ...formData, teamSize: e.target.value })
                }
                icon={<Users className="w-4 h-4" />}
                optional
              />
            </div>
          </div>

          {/* Collaboration Preferences Section */}
          <div className="space-y-5">
            <SectionHeader icon={<MessageSquare className="w-5 h-5" />} title="Collaboration Preferences" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Working Style"
                required
                options={["Remote", "Async", "Real-time"]}
                value={formData.collaborationType}
                onChange={(e) =>
                  setFormData({ ...formData, collaborationType: e.target.value })
                }
                icon={<Clock className="w-4 h-4" />}
              />

              <SelectField
                label="Preferred Contact Method"
                required
                options={["Chat", "Discord", "Email"]}
                value={formData.contactPreference}
                onChange={(e) =>
                  setFormData({ ...formData, contactPreference: e.target.value })
                }
                icon={<Mail className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <>
                  <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PlusCircle className="w-6 h-6" />
                  Create Collaboration Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ——— Section Header ——— */
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
    <span className="text-blue-600 dark:text-blue-400">{icon}</span>
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
  </div>
);

/* ——— Reusable Inputs ——— */
const InputField = ({ label, icon, optional, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
      {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
      {label}
      {optional && <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(optional)</span>}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
    />
  </div>
);

const TextAreaField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
      {label}
    </label>
    <textarea
      {...props}
      rows="4"
      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none resize-none transition-all"
    ></textarea>
  </div>
);

const SelectField = ({ label, options = [], icon, ...props }) => (
  <div>
    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
      {icon && <span className="text-blue-600 dark:text-blue-400">{icon}</span>}
      {label}
    </label>
    <select
      {...props}
      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all cursor-pointer"
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