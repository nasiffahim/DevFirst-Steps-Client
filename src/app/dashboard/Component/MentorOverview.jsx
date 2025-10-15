"use client";

import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import projectAnim from "../../../../public/Animation/No-project.json";
import blogAnim from "../../../../public/Animation/no-blogs.json";
import Lottie from "lottie-react";
import { Button } from "../../../Components/ui/button";
import Image from "next/image";

import {
  FolderKanban,
  Sparkles,
  Users as UsersIcon,
  TrendingUp,
  ArrowUpRight,
  BookmarkCheck,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import api from "../../../utils/api";
import BlogCard from "./BlogCard";
import ProjectCard from "./ProjectCard";

const MentorOverview = () => {
  const { user, loading } = useAuth();
  const email = user?.email;
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  console.log(dashboardData);

  const router = useRouter();

  useEffect(() => {
    if (!email) return;

    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/api/user/dashboard", {
          params: { email }, // if your API expects user email
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [email]);

  // fetch user role
  useEffect(() => {
    if (!email) return;

    const fetchRole = async () => {
      try {
        const res = await api.get("/user-role", {
          params: { email },
        });
        setRole(res.data.role);
      } catch (err) {
        console.error("Failed to fetch role", err);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [email]);

  if (loading || roleLoading || dashboardLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-300 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access the dashboard.
          </p>
        </div>
      </div>
    );
  }

  const statsArray = [
    {
      label: "Bookmarks",
      value: dashboardData?.stats?.bookmarks ?? 0,
      color: "from-blue-500 to-blue-700",
      icon: BookmarkCheck,
    },
    {
      label: "Projects",
      value: dashboardData?.stats?.projects ?? 0,
      color: "from-green-500 to-green-700",
      icon: FolderKanban,
    },
    {
      label: "Blogs",
      value: dashboardData?.stats?.blogs ?? 0,
      color: "from-purple-500 to-purple-700",
      icon: FileText,
    },
    {
      label: "Project Matches",
      value: dashboardData?.stats?.projectMatches ?? 0,
      color: "from-orange-500 to-orange-700",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Welcome Banner - User Only */}
      {role === "user" && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 text-white shadow-lg border border-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Welcome back, Mentor {user?.name || "Developer"}! 👋
              </h1>
              <p className="text-gray-300 text-sm">
                Here's what's happening with your projects and blogs today.
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-gray-400 opacity-50" />
          </div>
        </div>
      )}

      {/* Stats Cards - User */}
      {role === "user" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statsArray.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shadow-sm`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blogs Section */}
      {role === "user" && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Latest Blogs
            </h2>
            <button
              onClick={() => router.push("/dashboard/my-blogs")}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData?.latest?.blogs?.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                <Lottie
                  animationData={blogAnim}
                  loop
                  className="h-48 opacity-80"
                />
                <p className="text-center mt-4 text-gray-600 dark:text-gray-400 font-medium">
                  No blogs yet
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Start sharing your knowledge with the community
                </p>
                <Button
                  onClick={() => router.push("/dashboard/add-blogs")}
                  className="mt-6 bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors px-6 py-2 rounded-lg shadow-sm"
                >
                  Write Your First Blog
                </Button>
              </div>
            ) : (
              dashboardData?.latest?.blogs?.map((b) => (
                <BlogCard key={b.id} blog={b} />
              ))
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {role === "user" && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Latest Projects
            </h2>
            <button
              onClick={() => router.push("/dashboard/my-projects")}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              View all
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData?.latest?.projects?.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-10 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                <Lottie
                  animationData={projectAnim}
                  loop
                  className="h-48 opacity-80"
                />
                <p className="text-center mt-4 text-gray-600 dark:text-gray-400 font-medium">
                  No projects yet
                </p>
                <p className="text-center text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Create your first project and showcase your work
                </p>
                <Button
                  onClick={() => router.push("/dashboard/add-projects")}
                  className="mt-6 bg-gray-900 dark:bg-gray-800 text-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors px-6 py-2 rounded-lg shadow-sm"
                >
                  Add Your First Project
                </Button>
              </div>
            ) : (
              dashboardData?.latest?.projects?.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default MentorOverview;
