"use client";
import React, { useState } from "react";
import api from "../../../utils/api";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function BecomeMentor() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    expertise: "",
    experience: "",
    availability: "",
    motivation: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.expertise.trim() ||
      !form.experience.trim() ||
      !form.availability.trim() ||
      !form.motivation.trim()
    ) {
      Swal.fire({
        icon: "warning",
        title: "All fields are required!",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/apply-mentor",form, { withCredentials: true });

      Swal.fire({
        icon: "success",
        title: "Application Submitted!",
        text: res.data.message || "Your mentor request has been sent for review.",
        confirmButtonColor: "#2563eb",
      });

      // Clear form
      setForm({
        expertise: "",
        experience: "",
        availability: "",
        motivation: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto p-8 bg-white rounded-2xl my-16 shadow-lg border"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Become a Mentor
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Expertise</label>
          <input
            name="expertise"
            placeholder="e.g. MERN, Django, DevOps"
            value={form.expertise}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Experience</label>
          <input
            name="experience"
            placeholder="e.g. 3 years"
            value={form.experience}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Availability</label>
          <input
            name="availability"
            placeholder="e.g. weekends, evenings"
            value={form.availability}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Motivation</label>
          <textarea
            name="motivation"
            placeholder="Why do you want to become a mentor?"
            value={form.motivation}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </motion.div>
  );
}
