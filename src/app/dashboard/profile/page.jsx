"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";
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
} from "lucide-react";

export default function ProfilePage() {
  const [tab, setTab] = useState("blogs");
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);
  const [points, setPoints] = useState(0);
  const [badge, setBadge] = useState(null);
  const email = user?.email;

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

  const projects = [
    { title: "Python Explorer", link: "#", tech: "Python", stars: 45 },
    { title: "Web Scraper Toolkit", link: "#", tech: "JavaScript", stars: 32 },
    { title: "Linux Resource Manager", link: "#", tech: "Shell", stars: 28 },
  ];

  const blogs = [
    {
      title: "Getting Started with Open Source",
      description: "Tips and resources for making your first contribution.",
      date: "Dec 15, 2024",
      views: 1234,
    },
    {
      title: "Top 5 Open Source Projects",
      description: "Explore trending projects and how to get involved.",
      date: "Dec 10, 2024",
      views: 892,
    },
  ];

  const communityPosts = [
    {
      text: "This is an awesome project!",
      info: "Check out more open-source projects by JohnDoe.",
      date: "2 days ago",
    },
    {
      text: "Loved your latest blog on open-source resources.",
      info: "Let's talk about new projects in the community!",
      date: "5 days ago",
    },
  ];

  if (loading) {
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

      {/* Tabs */}
      <section className="max-w-lg mx-auto px-4 mt-8">
        <div className="flex justify-center items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mx-auto">
          <button
            onClick={() => setTab("blogs")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === "blogs"
                ? "bg-gray-900 dark:bg-gray-800 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            Blogs
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === "projects"
                ? "bg-gray-900 dark:bg-gray-800 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            Projects
          </button>
          <button
            onClick={() => setTab("community")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === "community"
                ? "bg-gray-900 dark:bg-gray-800 text-white shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Community
          </button>
        </div>
      </section>

      {/* Conditional Sections */}
      <section className="max-w-6xl mx-auto py-10 px-4">
        {tab === "blogs" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              My Recent Blog Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {blog.title}
                    </h3>
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {blog.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.date}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {blog.views} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "projects" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              My Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full mb-4 flex items-center justify-center">
                      <FolderGit2 className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {proj.title}
                    </h3>
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-full mb-3">
                      {proj.tech}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500 mb-4">
                      <span>⭐</span>
                      <span>{proj.stars} stars</span>
                    </div>
                    <a
                      href={proj.link}
                      className="flex items-center gap-2 text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "community" && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Community Interaction
            </h2>
            <div className="space-y-4">
              {communityPosts.map((post, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        "{post.text}"
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {post.info}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {post.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
