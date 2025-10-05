"use client";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";
import { X, User, MapPin, GraduationCap, Briefcase, Linkedin, Github, FileText, Camera, Save } from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Button } from "../../../Components/ui/button";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const popularSkills = [
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "Python",
  "Django",
  "Flask",
  "TypeScript",
  "HTML",
  "CSS",
  "Tailwind",
  "Git",
  "GitHub",
  "SQL",
  "Docker",
];

// Generate floating background icons
const generateFloatingIcons = (count) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 20 + Math.random() * 30,
    rotate: Math.random() * 360,
    color: ["#FACC15", "#3B82F6", "#14B8A6", "#A78BFA"][
      Math.floor(Math.random() * 4)
    ],
  }));

const EditProfilePage = () => {
  const { user, loading } = useAuth();
  const [databaseUser, setDatabaseUser] = useState(null);
  const [databaseLoading, setDatabaseLoading] = useState(true);
  const email = user?.email;
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
    address: "",
    education: "",
    skills: [],
    linkedin: "",
    github: "",
    resume: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [floatingIcons] = useState(generateFloatingIcons(15));

  // Fetch user role
  useEffect(() => {
    if (!email) return;
    const getRole = async () => {
      try {
        const res = await api.get("/user-role", { params: { email } });
        setRole(res.data.role);
      } catch (err) {
        console.error(err);
      }
    };
    getRole();
  }, [email]);

  // Fetch user data from DB
  useEffect(() => {
    if (!email) return;
    const fetchUserData = async () => {
      try {
        setDatabaseLoading(true);
        const res = await api.get("/single_user", {
          params: { emailParams: email },
        });
        setDatabaseUser(res.data);
        setFormData({
          displayName: res.data.username || "",
          photoURL: res.data.image || "",
          address: res.data.address || "",
          education: res.data.education || "",
          skills: res.data.skills || [],
          linkedin: res.data.linkedin || "",
          github: res.data.github || "",
          resume: res.data.resume || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setDatabaseLoading(false);
      }
    };
    fetchUserData();
  }, [email]);

  // Skills input handlers
  const handleSkillChange = (e) => {
    const value = e.target.value;
    setSkillInput(value);

    if (!value.trim()) {
      setFilteredSkills([]);
      return;
    }

    const suggestions = popularSkills.filter(
      (skill) =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !formData.skills.includes(skill)
    );
    setFilteredSkills(suggestions);
  };

  const handleAddSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
    setSkillInput("");
    setFilteredSkills([]);
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosSecure.put(
        "/update_user",
        formData,
        { params: { email } }
      );

      if (res.status === 200) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Profile updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Failed to update profile",
        text: error.response?.data?.message || "Something went wrong",
        showConfirmButton: true,
      });
    }
  };

  if (loading || databaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Floating Background */}
      {floatingIcons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute rounded-full opacity-20 dark:opacity-10"
          style={{
            top: `${icon.top}%`,
            left: `${icon.left}%`,
            width: icon.size,
            height: icon.size,
            backgroundColor: icon.color,
          }}
          animate={{
            y: [0, 20, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6 overflow-hidden border border-gray-200 dark:border-gray-700">
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

        {/* Edit Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Profile
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Update your personal information and professional details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            {/* Education */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Education
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="Your degree, university..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Skills
              </label>
              
              {/* Skills Tags */}
              {formData.skills.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  {formData.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Skills Input */}
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={handleSkillChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (skillInput.trim()) {
                        handleAddSkill(skillInput);
                      }
                    }
                  }}
                  placeholder="Type a skill and press Enter"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition"
                />
                {filteredSkills.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mt-2 rounded-lg shadow-lg max-h-48 overflow-auto">
                    {filteredSkills.map((skill) => (
                      <li
                        key={skill}
                        onClick={() => handleAddSkill(skill)}
                        className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer text-gray-900 dark:text-white transition"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Select from suggestions or type your own and press Enter
              </p>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Linkedin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Github className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                GitHub
              </label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            {/* Resume */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Resume
              </label>
              <input
                type="text"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                placeholder="Link to resume (PDF)"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;