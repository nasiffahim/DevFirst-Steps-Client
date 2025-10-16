"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import { Timer, UserPlus } from "lucide-react";
import Link from "next/link";

export default function MentorDetailPage() {
  const { id } = useParams();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentor = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/mentors/${id}`);
        setMentor(res.data);
      } catch (err) {
        console.error("Error fetching mentor:", err);
        setError("Failed to load mentor details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMentor();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10">Loading mentor details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!mentor) return <p className="text-center mt-10">Mentor not found.</p>;

  return (
    <div>
      <div className="mt-10 p-8 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[3px] shadow-md">
            <img
              src={
                mentor.image || "https://i.ibb.co/2d3Yqz0/default-avatar.png"
              }
              alt={mentor.username || "Mentor"}
              className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-900"
            />
          </div>

          {/* Mentor Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {mentor.username || "Unnamed Mentor"}
            </h1>

            <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">
              {mentor.expertise || "No expertise listed"}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
              <strong>motivation:</strong>{" "}
              {mentor.motivation || "No motivation available."}
            </p>

            {mentor.experience && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                🎓 <strong>Experience:</strong> {mentor.experience} years
              </p>
            )}

            {mentor.availability && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🕒 <strong>Availability:</strong> {mentor.availability}
              </p>
            )}

            {mentor.email && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                📧 <strong>Email:</strong> {mentor.email}
              </p>
            )}

            {mentor.role && (
              <p className="flex items-center gap-1 mt-3 text-sm text-gray-600 dark:text-gray-400">
                <UserPlus /> <strong>Role: </strong> {mentor.role}
              </p>
            )}
            {mentor.createdAt && (
              <p className="flex items-center gap-1 mt-3 text-sm text-gray-600 dark:text-gray-400">
                <Timer></Timer> <strong>CreatedAt: </strong> {mentor.createdAt}
              </p>
            )}
            {mentor.badge && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                🏅 <strong>Badge:</strong> {mentor.badge}
              </p>
            )}

            {mentor.points !== undefined && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                ⭐ <strong>Points:</strong> {mentor.points}
              </p>
            )}

            {/* Action Button */}
            <div className="mt-6">
              <Link
              href={"/dashboard/mentorRequestForm"}
               className="cursor-pointer px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-transform transform hover:scale-105">
                Request Mentorship
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
