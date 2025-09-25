"use client";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import AdminOverview from "../dashboard/Component/adminOverview"
const Page = () => {
  const { user, loading } = useAuth();
  const email = user?.email;
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

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
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  // stats (can be role-specific)
  const userStats = [
    { label: "My Blog", value: 12 },
    { label: "My Project", value: 88 },
    { label: "Bookmark Project", value: 7 },
    { label: "Project Match", value: 5 },
  ];

  const adminStats = [
    { label: "Total Users", value: 120 },
    { label: "Total Projects", value: 450 },
    { label: "Pending Approvals", value: 14 },
    { label: "Reports", value: 3 },
  ];

  // Sample placeholders
  const blogs = [1, 2, 3];
  const projects = [1, 2];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(role === "admin" ? adminStats : userStats).map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm"
          >
            <span className="text-2xl font-bold text-gray-800">
              {item.value}
            </span>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Latest Blog (only for user) */}
      {role === "user" && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Latest Blog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {blogs.map((b) => (
              <div
                key={b}
                className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500"
              >
                Blog {b}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Latest Projects (for both, but different meaning maybe) */}
      {role === "user" && (
        <section>
          <div className="text-lg font-semibold text-gray-800 mb-3">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Latest Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div
                key={p}
                className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500"
              >
                Project {p}
              </div>
            ))}
          </div>
        </section>
      )}
      {role === "admin" && (
        <AdminOverview />
      )}
    </div>
  );
};

export default Page;
