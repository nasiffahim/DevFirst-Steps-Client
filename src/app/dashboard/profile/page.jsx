"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";
import {
  EducationSection,
  ExperienceSection,
  LinksSection,
  SkillsSection,
} from "./ProfileSections";
import {
  Settings,
  Edit3,
  FileText,
  FolderGit2,
  MessageCircle,
  ExternalLink,
  Github,
  Calendar,
  Mail,
  Shield,
  Award,
  TrendingUp,
  Plus,
} from "lucide-react";
import { set } from "react-hook-form";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [points, setPoints] = useState(0);
  const [badge, setBadge] = useState(null);
  const [userFromDatabase, setUserFromDatabase] = useState(null);
  const [databaaseLoading, setDatabaseLoading] = useState(false);
  const email = user?.email;

  console.log(userFromDatabase);

  useEffect(() => {
    if (!email) return;

    const fetchUserInfo = async () => {
      try {
        const res = await api.get("/user-role", {
          params: { email },
        });
        setRole(res.data.role);
        setPoints(res.data.points);
        setBadge(res.data.badge);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    fetchUserInfo();
  }, [email]);

  useEffect(() => {
    if (!email) return;

    const fetchUserFromDatabase = async () => {
      setDatabaseLoading(true);
      try {
        const res = await api.get("/single_user", {
          params: { emailParams: email }, // match backend
        });
        setUserFromDatabase(res.data);
        setDatabaseLoading(false);
      } catch (err) {
        console.error("Failed to fetch user from database", err);
        setDatabaseLoading(false);
      }
    };

    fetchUserFromDatabase();
  }, [email]);

  const getBadgeColor = (badgeType) => {
    switch (badgeType?.toLowerCase()) {
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900";
      case "silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900";
      case "bronze":
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-orange-900";
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-700";
    }
  };
  const educationList = [
    {
      degree: "BS in Computer Science",
      university: "Holy Name University",
      location: "Tagbilaran City, Bohol",
      year: "2002–2006",
    },
    // You can add more here if needed
  ];

  if (loading || databaaseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-300 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">No user logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg">
                  <img
                    src={user.photoURL}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {user.displayName}
                </h1>
                <div className="flex flex-col gap-1">
                  <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    {role
                      ? `${role.charAt(0).toUpperCase() + role.slice(1)}`
                      : "User"}
                  </p>
                </div>
              </div>
            </div>

            {/* Points and Badge Section for Users */}
            {role && role.toLowerCase() !== "admin" && (
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Points Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 min-w-[140px] shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Points
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {points}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      pts
                    </span>
                  </div>
                </div>

                {/* Badge Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 min-w-[140px] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Badge
                    </span>
                  </div>
                  {badge ? (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ${getBadgeColor(
                          badge
                        )}`}
                      >
                        {badge.toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      No badge yet
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <Link href="/dashboard/edit-profile">
                <button className="flex items-center gap-2 bg-gray-900 dark:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm">
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}

      {userFromDatabase && (
        <>
          <EducationSection educationList={userFromDatabase.education} />
          <ExperienceSection experienceList={userFromDatabase.experience} />
          <SkillsSection skillsList={userFromDatabase.skills} />
          <LinksSection
            linkedin={userFromDatabase.linkedin}
            github={userFromDatabase.github}
            resume={userFromDatabase.resume}
          />
        </>
      )}
    </div>
  );
}
