"use client";
import React, { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Button } from "../../../Components/ui/button";
import useAxiosSecure from "../../hooks/useAxiosSecure"; // ✅ import the hook

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
    const axiosSecure = useAxiosSecure(); // ✅ call the hook, don’t import directly


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
      // Call backend update endpoint
      const res = await axiosSecure.put(
        "/update_user",
        formData,
        { params: { email } } // pass email as query param
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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 p-6 overflow-hidden">
      {/* Floating Background */}
      {floatingIcons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute rounded-full opacity-30"
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

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md relative z-10">
        <div className="mx-auto text-center">
          <h1 className="text-2xl font-semibold mb-2 text-gray-800">
            Edit Profile
          </h1>
        </div>

        {/* Top Grid Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
          {/* Left - Image */}
          <div className="flex justify-center md:justify-start">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200">
              {formData.photoURL ? (
                <img
                  src={formData.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Right - User Info */}
          <div className=" space-y-2 text-center md:text-left">
            <p className="text-lg font-semibold text-gray-800">
              {formData.displayName || "Unnamed User"}
            </p>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="text-sm font-medium text-indigo-600">
              {role || "User"}
            </p>
          </div>
        </div>

        {/* Editable Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Education */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Education
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              placeholder="Your degree, university..."
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Skills
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-red-500 font-bold"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={skillInput}
                onChange={handleSkillChange}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddSkill(skillInput)
                }
                placeholder="Type a skill and press Enter"
                className="w-full p-2 border rounded-lg"
              />
              {filteredSkills.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border mt-1 rounded-lg shadow max-h-40 overflow-auto">
                  {filteredSkills.map((skill) => (
                    <li
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Links */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              GitHub
            </label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Resume
            </label>
            <input
              type="text"
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              placeholder="Link to resume (PDF)"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="bg-indigo-600 text-white hover:bg-indigo-500 px-6 py-2 rounded-lg cursor-pointer"
          >
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
