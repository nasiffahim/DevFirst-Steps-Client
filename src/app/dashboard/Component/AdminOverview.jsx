"use client";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FFF"];

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await fetch("http://localhost:5000/admin-overview");
        const json = await res.json();
        setData(json);
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

  return (
    <div className="space-y-8 p-6">
      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold">{data.totalUsers}</h2>
          <p className="text-gray-500">Total Users</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow text-center">
          <h2 className="text-xl font-bold">{data.totalProjects}</h2>
          <p className="text-gray-500">Total Projects</p>
        </div>
      </div>

      {/* Projects per User (Bar Chart) */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Projects Per User</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.projectsPerUser}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="projectCount" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Projects by Category (Pie Chart) */}
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Recent Projects */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Projects</h2>
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Project Name</th>
                <th className="px-4 py-2">Created By</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {data.recentProjects.map((proj) => (
                <tr key={proj._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{proj.name}</td>
                  <td className="px-4 py-2">{proj.createdBy}</td>
                  <td className="px-4 py-2">{new Date(proj.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
