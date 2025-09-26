"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AdminOverview from "../dashboard/Component/adminOverview";
import projectAnim from "../../../public/Animation/No-project.json";
import blogAnim from "../../../public/Animation/no-blogs.json";
import Lottie from "lottie-react";
import { Button } from "../../Components/ui/button";
import Image from "next/image";

import {
  BookOpen,
  FolderKanban,
  Bookmark,
  Sparkles,
  Users,
  FileBox,
  Clock,
  AlertTriangle,
  Star,
  Users as UsersIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ✅ Reusable Blog Card
const BlogCard = ({ blog }) => (
  <div className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition">
    <img
      src={blog.thumbnail}
      alt={blog.title}
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h3 className="text-base font-semibold text-gray-800">{blog.title}</h3>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{blog.excerpt}</p>
      <div className="text-xs text-gray-400 mt-2">
        By {blog.author} • {blog.date}
      </div>
    </div>
  </div>
);

// ✅ Reusable Project Card
const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-xl shadow-md border overflow-hidden hover:shadow-lg transition">
    <img
      src={project.thumbnail}
      alt={project.name}
      className="w-full h-40 object-cover"
    />
    <div className="p-4">
      <h3 className="text-base font-semibold text-gray-800">{project.name}</h3>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {project.description}
      </p>
      <div className="flex justify-between text-xs text-gray-400 mt-3">
        <span className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500" /> {project.stars}
        </span>
        <span className="flex items-center gap-1">
          <UsersIcon className="w-4 h-4 text-indigo-500" />{" "}
          {project.contributors}
        </span>
      </div>
    </div>
  </div>
);

const Page = () => {
  const { user, loading } = useAuth();
  const email = user?.email;
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const router = useRouter();

  // fetch user role
  useEffect(() => {
    if (!email) return;
    async function fetchRole() {
      try {
        const res = await fetch(
          `http://localhost:5000/user-role?email=${email}`
        );
        const data = await res.json();
        setRole(data.role);
      } catch (err) {
        console.error("Failed to fetch role", err);
      } finally {
        setRoleLoading(false);
      }
    }
    fetchRole();
  }, [email]);

  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center h-screen">Loading...</div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Please log in to access the dashboard.
      </div>
    );
  }

  // ✅ Stats with icons
  const userStats = [
    { label: "My Blog", value: 12, icon: BookOpen },
    { label: "My Project", value: 88, icon: FolderKanban },
    { label: "Bookmark Project", value: 7, icon: Bookmark },
    { label: "Project Match", value: 5, icon: Sparkles },
  ];

  const adminStats = [
    { label: "Total Users", value: 120, icon: Users },
    { label: "Total Projects", value: 450, icon: FileBox },
    { label: "Pending Approvals", value: 14, icon: Clock },
    { label: "Reports", value: 3, icon: AlertTriangle },
  ];

// Sample static data with thumbnails
const blogs = [
  {
    id: 1,
    title: "Getting Started with Open Source",
    excerpt: "Learn how to make your first contribution to open-source projects...",
    author: "Jane Doe",
    date: "2025-09-20",
    thumbnail: "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Top 5 GitHub Repositories for Beginners",
    excerpt: "A curated list of beginner-friendly repositories to help you start...",
    author: "John Smith",
    date: "2025-09-18",
    thumbnail: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fHByb2dyYW1taW5nfGVufDB8fDB8fHww",
  },
  {
    id: 3,
    title: "Why Open Source Matters",
    excerpt: "Exploring the impact of open source on tech innovation and community...",
    author: "Emily Johnson",
    date: "2025-09-15",
    thumbnail: "https://images.unsplash.com/photo-1637073849667-91120a924221?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGV2ZWxvcGVyc3xlbnwwfHwwfHx8MA%3D%3D",
  },
];

const projects = [
  {
    id: 1,
    name: "Next.js Starter Kit",
    description: "A boilerplate for building fast, scalable apps with Next.js and Tailwind CSS.",
    stars: 120,
    contributors: 15,
    thumbnail: "https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV4dGpzfGVufDB8fDB8fHww",
  },
  {
    id: 2,
    name: "Open Source Finder",
    description: "A platform that connects developers with open source projects.",
    stars: 240,
    contributors: 32,
    thumbnail: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    name: "React UI Components",
    description: "Reusable, accessible, and customizable React components for modern apps.",
    stars: 90,
    contributors: 8,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVhY3R8ZW58MHx8MHx8fDA%3D",
  },
];



  return (
    <div className="space-y-10 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(role === "admin" ? adminStats : userStats).map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 flex flex-col items-center shadow-sm border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-3xl font-bold text-gray-800">
                {item.value}
              </span>
              <span className="text-sm text-gray-600 mt-1">{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Blogs Section */}
      {role === "user" && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Latest Blogs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <Lottie animationData={blogAnim} loop className="h-52" />
                <p className="text-center mt-3">No blogs found.</p>
                <Button
                  onClick={() => router.push("/dashboard/add-blogs")}
                  className="mt-4 bg-gray-800 text-white hover:bg-gray-700 transition"
                >
                  Write a Blog
                </Button>
              </div>
            ) : (
              blogs.map((b) => <BlogCard key={b.id} blog={b} />)
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {role === "user" && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Latest Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <Lottie animationData={projectAnim} loop className="h-52" />
                <p className="text-center mt-3">No project found.</p>
                <Button
                  onClick={() => router.push("/dashboard/add-projects")}
                  className="mt-4 bg-gray-800 text-white hover:bg-gray-700 transition"
                >
                  Add Project
                </Button>
              </div>
            ) : (
              projects.map((p) => <ProjectCard key={p.id} project={p} />)
            )}
          </div>
        </section>
      )}

      {/* Admin Overview */}
      {role === "admin" && <AdminOverview />}
    </div>
  );
};

export default Page;
