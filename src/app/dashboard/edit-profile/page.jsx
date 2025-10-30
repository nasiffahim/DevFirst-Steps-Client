"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";
import {
  User,
  MapPin,
  GraduationCap,
  Wrench,
  Linkedin,
  Github,
  FileText,
  Save,
  X,
  Camera,
  Briefcase,
  Plus,
} from "lucide-react";
import Swal from "sweetalert2";

export default function EditProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
    address: "",
    education: [],
    experience: [],
    skills: [],
    linkedin: "",
    github: "",
    resume: "",
  });

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const email = user?.email;

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      }));
    }

    const fetchRole = async () => {
      try {
        const res = await api.get("/user-role", { params: { email } });
        setRole(res.data.role || "User");
      } catch {
        setRole("User");
      }
    };
    if (email) fetchRole();
  }, [user, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/update_user?email=${email}`, { ...formData }); // email in query, data in body

      // added badge point
      if (email) {
        await api.post("/update-activity", {
          email: email,
          activityType: "userProfileUpdate-addition",
        });
      }
      Swal.fire({
        icon: "success",
        title: "Profile updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      router.push("/dashboard/profile");
    } catch (error) {
      console.error(error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-10">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-8 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-[#113F67] h-32"></div>
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-xl">
                  {formData.photoURL ? (
                    <img
                      src={formData.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <User className="w-16 h-16" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left space-y-2 mt-4 sm:mt-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {formData.displayName || "Unnamed User"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2">
                  <User className="w-4 h-4" />
                  {email}
                </p>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                  <Briefcase className="w-4 h-4" />
                  {role || "User"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======= FORM ======= */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <InputField
            icon={
              <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            }
            label="Display Name"
            value={formData.displayName}
            onChange={(val) => setFormData({ ...formData, displayName: val })}
          />
          <InputField
            icon={
              <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            }
            label="Address"
            placeholder="City, Country"
            value={formData.address}
            onChange={(val) => setFormData({ ...formData, address: val })}
          />

          {/* Education */}
          <EducationSection formData={formData} setFormData={setFormData} />

          {/* Experience */}
          <ExperienceSection formData={formData} setFormData={setFormData} />

          {/* Skills */}
          <SkillsSection formData={formData} setFormData={setFormData} />

          {/* Links */}
          <InputField
            icon={
              <Linkedin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            }
            label="LinkedIn"
            value={formData.linkedin}
            placeholder="https://linkedin.com/in/yourprofile"
            onChange={(val) => setFormData({ ...formData, linkedin: val })}
          />
          <InputField
            icon={
              <Github className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            }
            label="GitHub"
            value={formData.github}
            placeholder="Your GitHub url"
            onChange={(val) => setFormData({ ...formData, github: val })}
          />
          <InputField
            icon={
              <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            }
            label="Resume (URL)"
            value={formData.resume}
            placeholder="https://example.com/your-resume.pdf"
            onChange={(val) => setFormData({ ...formData, resume: val })}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------ REUSABLE INPUT FIELD ------------------ */
function InputField({ icon, label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {icon}
        {label}
      </label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </div>
  );
}

/* ---------------- EDUCATION SECTION ---------------- */
function EducationSection({ formData, setFormData }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Education
      </label>

      {formData.education.map((edu, index) => (
        <EducationOrWorkBlock
          key={index}
          type="education"
          index={index}
          data={edu}
          formData={formData}
          setFormData={setFormData}
        />
      ))}

      <AddButton
        label="Add Education"
        onClick={() =>
          setFormData({
            ...formData,
            education: [
              ...formData.education,
              {
                degree: "",
                university: "",
                start: "",
                end: "",
                ongoing: false,
              },
            ],
          })
        }
      />
    </div>
  );
}

/* ---------------- EXPERIENCE SECTION ---------------- */
function ExperienceSection({ formData, setFormData }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Work Experience
      </label>

      {formData.experience.map((exp, index) => (
        <EducationOrWorkBlock
          key={index}
          type="experience"
          index={index}
          data={exp}
          formData={formData}
          setFormData={setFormData}
        />
      ))}

      <AddButton
        label="Add Work Experience"
        onClick={() =>
          setFormData({
            ...formData,
            experience: [
              ...formData.experience,
              {
                title: "",
                company: "",
                start: "",
                end: "",
                ongoing: false,
                description: "",
              },
            ],
          })
        }
      />
    </div>
  );
}

/* ---------------- EDUCATION/WORK COMMON BLOCK ---------------- */
function EducationOrWorkBlock({ type, index, data, formData, setFormData }) {
  const listName = type === "education" ? "education" : "experience";

  const handleChange = (field, value) => {
    const updated = [...formData[listName]];
    updated[index][field] = value;
    setFormData({ ...formData, [listName]: updated });
  };

  return (
    <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-gray-800/50 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder={type === "education" ? "Degree" : "Job Title"}
          value={data.degree || data.title || ""}
          onChange={(e) =>
            handleChange(
              type === "education" ? "degree" : "title",
              e.target.value
            )
          }
          className="input"
        />
        <input
          type="text"
          placeholder={type === "education" ? "University" : "Company"}
          value={data.university || data.company || ""}
          onChange={(e) =>
            handleChange(
              type === "education" ? "university" : "company",
              e.target.value
            )
          }
          className="input"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
            Start Date
          </label>
          <input
            type="month"
            value={data.start}
            onChange={(e) => handleChange("start", e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
            End Date
          </label>
          <input
            type="month"
            value={data.end}
            disabled={data.ongoing}
            onChange={(e) => handleChange("end", e.target.value)}
            className={`input ${
              data.ongoing ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mt-1">
        <input
          type="checkbox"
          checked={data.ongoing}
          onChange={(e) => handleChange("ongoing", e.target.checked)}
        />
        Currently {type === "education" ? "Studying" : "Working"}
      </label>

      {type === "experience" && (
        <textarea
          placeholder="Description (role, achievements, etc.)"
          value={data.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full mt-3 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      )}

      <button
        type="button"
        onClick={() => {
          const updated = formData[listName].filter((_, i) => i !== index);
          setFormData({ ...formData, [listName]: updated });
        }}
        className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
      >
        <X className="w-4 h-4" /> Remove
      </button>
    </div>
  );
}

/* ---------------- ADD BUTTON ---------------- */
function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
    >
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

/* ---------------- SKILLS SECTION WITH AUTOCOMPLETE ---------------- */
function SkillsSection({ formData, setFormData }) {
  const predefinedSkills = [
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "TypeScript",
    "JavaScript",
    "HTML",
    "CSS",
    "TailwindCSS",
    "Redux",
    "GraphQL",
    "Python",
    "Django",
    "Java",
    "C++",
    "Git",
    "Docker",
    "AWS",
  ];

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setInput("");
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input.trim());
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value) {
      const filtered = predefinedSkills.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !formData.skills.includes(skill)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const removeSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updated });
  };

  return (
    <div className="relative">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        <Wrench className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        Skills / Technologies
      </label>

      <div className="flex flex-wrap gap-2 mb-2">
        {formData.skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-indigo-100 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm flex items-center gap-1"
          >
            {skill}
            <X
              className="w-3 h-3 cursor-pointer hover:text-red-500"
              onClick={() => removeSkill(index)}
            />
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type and press Enter..."
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
          {suggestions.map((skill, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-700 cursor-pointer"
              onClick={() => addSkill(skill)}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
