"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AdminOverview from "../dashboard/Component/adminOverview";
import projectAnim from "../../../public/Animation/No project.json";
import blogAnim from "../../../public/Animation/no blogs.json";
import Lottie from "lottie-react";
import { Button } from "../../Components/ui/button";
import {
  BookOpen,
  FolderKanban,
  Bookmark,
  Sparkles,
  Users,
  FileBox,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, loading } = useAuth();
  const email = user?.email;
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const router = useRouter(); // ✅ init router

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

  // stats (with icons)
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

  // Sample placeholders
  const blogs = [];
  const projects = [];

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

      {/* Latest Blog (only for user) */}
      {role === "user" && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Latest Blog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {blogs.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <Lottie animationData={blogAnim} loop className="h-52" />
                <p className="text-center mt-3">No blogs found.</p>
                <Button className="block cursor-pointer mt-2 bg-gray-800 text-white text-center py-2 rounded-lg text-sm hover:bg-gray-700 transition">
                  Write a Blog
                </Button>
              </div>
            ) : (
              blogs.map((b) => (
                <div
                  key={b}
                  className="bg-gray-50 h-32 rounded-lg flex items-center justify-center shadow-sm border border-gray-200"
                >
                  Blog {b}
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* Latest Projects */}
      {role === "user" && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Latest Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center text-gray-500 p-6 bg-white rounded-xl shadow-md border border-gray-100">
                <Lottie animationData={projectAnim} loop className="h-52" />
                <p className="text-center mt-3">No project found.</p>
                <Button onClick={() => router.push("/dashboard/add-projects")}  className="block mt-2 cursor-pointer bg-gray-800 text-white text-center py-2 rounded-lg text-sm hover:bg-gray-700 transition">
                  Add Project
                </Button>
              </div>
            ) : (
              projects.map((p) => (
                <div
                  key={p}
                  className="bg-gray-50 h-32 rounded-lg flex items-center justify-center shadow-sm border border-gray-200"
                >
                  Project {p}
                </div>
              ))
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
