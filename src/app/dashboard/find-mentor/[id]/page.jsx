"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../../../utils/api";
import { 
  Timer, 
  UserPlus, 
  Mail, 
  Briefcase, 
  Clock, 
  Award, 
  Star, 
  Loader2,
  ArrowLeft,
  Calendar,
  MessageSquare,
  User
} from "lucide-react";
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

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case "gold":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "silver":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300";
      case "bronze":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg">Loading mentor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Mail className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">{error}</p>
          <Link 
            href="/dashboard/find-mentor" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mentors
          </Link>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
            <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Mentor not found</p>
          <Link 
            href="/dashboard/find-mentor" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Mentors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/dashboard/find-mentor"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Mentors</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header Section with Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 h-32 sm:h-40"></div>

          {/* Profile Section */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16 sm:-mt-20">
              {/* Profile Picture */}
              <div className="relative">
                {mentor.image ? (
                  <img
                    src={mentor.image}
                    alt={mentor.username || "Mentor"}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-700 border-4 border-white dark:border-gray-800 shadow-xl flex items-center justify-center">
                    <User className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                  </div>
                )}
                
                {/* Points Badge */}
                {mentor.points !== undefined && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {mentor.points || 0}
                  </div>
                )}
              </div>

              {/* Name and Badge */}
              <div className="flex-1 text-center sm:text-left sm:mb-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white capitalize">
                    {mentor.username || "Unnamed Mentor"}
                  </h1>
                  {mentor.badge && (
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${getBadgeColor(mentor.badge)}`}>
                      <Award className="w-4 h-4" />
                      {mentor.badge}
                    </span>
                  )}
                </div>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
                  {mentor.expertise || "No expertise listed"}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Main Info */}
              <div className="space-y-6">
                {/* Motivation Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    Motivation
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    {mentor.motivation || "No motivation statement available."}
                  </p>
                </div>

                {/* Experience and Availability */}
                <div className="space-y-4">
                  {mentor.experience && (
                    <div className="flex items-start gap-3 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                      <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Experience</p>
                        <p className="text-gray-700 dark:text-gray-300">{mentor.experience} years</p>
                      </div>
                    </div>
                  )}

                  {mentor.availability && (
                    <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Availability</p>
                        <p className="text-gray-700 dark:text-gray-300 capitalize">{mentor.availability}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Contact & Meta Info */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    {mentor.email && (
                      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">Email</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm truncate">{mentor.email}</p>
                        </div>
                      </div>
                    )}

                    {mentor.role && (
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <UserPlus className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">Role</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm capitalize">{mentor.role}</p>
                        </div>
                      </div>
                    )}

                    {mentor.createdAt && (
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white text-sm">Member Since</p>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{formatDate(mentor.createdAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/dashboard/sessionRequestForm"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Timer className="w-5 h-5" />
                Request Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}