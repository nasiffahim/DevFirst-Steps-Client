"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../../utils/api";

export default function ProfilePage() {
  const [tab, setTab] = useState("blogs"); // default tab
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);
  const email = user?.email;
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
      } 
    };

    fetchRole();
  }, [email]);
  const projects = [
    { title: "Python Explorer", link: "#" },
    { title: "Web Scraper Toolkit", link: "#" },
    { title: "Linux Resource Manager", link: "#" },
  ];

  const blogs = [
    {
      title: "Getting Started with Open Source",
      description: "Tips and resources for making your first contribution.",
    },
    {
      title: "Top 5 Open Source Projects",
      description: "Explore trending projects and how to get involved.",
    },
  ];

  const communityPosts = [
    {
      text: "This is an awesome project!",
      info: "Check out more open-source projects by JohnDoe.",
    },
    {
      text: "Loved your latest blog on open-source resources.",
      info: "Let’s talk about new projects in the community!",
    },
  ];
   if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No user logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-800 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-600">
              <img src={user.photoURL} alt="Profile Picture"  className="rounded-full w-full h-full" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{user.displayName}</h1>
              <p className="text-sm text-gray-300">
              {user.email}
              </p>
              <p className="text-sm text-gray-300">
              {role ? `Role: ${role}` : "Role: User"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="bg-white border cursor-pointer border-black text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
              Setting
            </button>
            <Link href="/dashboard/edit-profile">
              <button className="bg-white cursor-pointer text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                Edit Profile
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setTab("blogs")}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === "blogs"
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Blogs
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === "projects"
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setTab("community")}
            className={`px-4 py-2 rounded text-sm font-medium ${
              tab === "community"
                ? "bg-black text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Community
          </button>
        </div>
      </section>

      {/* Conditional Sections */}
      <section className="max-w-6xl mx-auto py-10 px-4">
        {tab === "blogs" && (
          <>
            <h2 className="text-center text-2xl font-semibold mb-6">
              My Recent Blog Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map((blog, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white shadow rounded-lg hover:shadow-md transition"
                >
                  <h3 className="font-semibold text-lg">{blog.title}</h3>
                  <p className="text-sm text-gray-500">{blog.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "projects" && (
          <>
            <h2 className="text-center text-2xl font-semibold mb-6">
              My Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white shadow rounded-lg flex flex-col items-center hover:shadow-md transition"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                  <h3 className="font-semibold">{proj.title}</h3>
                  <a
                    href={proj.link}
                    className="mt-2 text-sm text-blue-500 hover:underline"
                  >
                    GitHub Link
                  </a>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "community" && (
          <>
            <h2 className="text-center text-2xl font-semibold mb-6">
              Community Interaction
            </h2>
            <div className="space-y-6">
              {communityPosts.map((post, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-gray-700">"{post.text}"</p>
                  <p className="text-sm text-gray-500 mt-2">{post.info}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
