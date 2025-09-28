"use client";

import api from "../../../utils/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Users,
  FolderGit2,
  AlertTriangle,
  Clock,
  GitBranch,
} from "lucide-react"; // 👈 use Lucide icons

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FFF"];

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(data);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await api.get("/admin-overview");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch admin overview", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOverview();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  // 👇 Stats configuration
  const adminStats = [
    {
      label: "Total Users",
      value: data.totalUsers,
      icon: Users,
    },
    {
      label: "Total Projects",
      value: data.totalProjects,
      icon: FolderGit2,
    },
    {
      label: "Pending Approval",
      value: data.pendingApproval,
      icon: Clock,
    },
    {
      label: "Reported Projects",
      value: data.reportedProjects,
      icon: AlertTriangle,
    },
    {
      label: "DB Projects",
      value: data.dbProjects,
      icon: GitBranch,
    },
    {
      label: "GitHub Projects",
      value: data.githubProjects,
      icon: GitBranch,
    },
  ];

  return (
    <div className="">
      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((item, idx) => {
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

      {/* Projects per User (Bar Chart) */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Projects by Category</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.projectsByTech}>
              <XAxis dataKey="tech" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Projects by Category (Pie Chart)
      <section>
        <h2 className="text-lg font-semibold mb-3">Projects by Category</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.projectsByCategory}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.projectsByCategory.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section> */}

      {/* Recent Projects */}
      <section className="mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mb-4">

          {/* ----- recent projects --------- */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Recent Projects</h2>
            <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2">Project Name</th>
                    <th className="px-4 py-2">language</th>
                    <th className="px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentProjects.map((proj) => (
                    <tr key={proj._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{proj.name}</td>
                      <td className="px-4 py-2">{proj.language}</td>
                      <td className="px-4 py-2">
                        {new Date(proj.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Recent blogs</h2>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Project Name</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.recentBlogs?.map((proj) => (
                <tr key={proj._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{proj.title}</td>
                  <td className="px-4 py-2">{proj.author}</td>
                  <td className="px-4 py-2">
                    {new Date(proj.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
