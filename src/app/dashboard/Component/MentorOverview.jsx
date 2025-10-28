"use client";

import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import {
  CalendarDays,
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import api from "../../../utils/api";
import Swal from "sweetalert2";

const MentorOverview = () => {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    scheduled: 0,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch session requests & scheduled sessions together
        const [reqRes, sessionRes] = await Promise.allSettled([
          api.get(`/session-requests?email=${user.email}`),
          api.get(`/schedule-session?email=${user.email}`),
        ]);

        const requests = reqRes.status === "fulfilled" ? reqRes.value.data : [];
        const sessions =
          sessionRes.status === "fulfilled" ? sessionRes.value.data : [];

        // Calculate status-based stats
        const pending = requests.filter((r) => r.status === "pending").length;
        const approved = requests.filter((r) => r.status === "approved").length;
        const rejected = requests.filter((r) => r.status === "rejected").length;

        setStats({
          pending,
          approved,
          rejected,
          scheduled: sessions.length,
        });

        // Limit recent data

        setRecentRequests(
          requests
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );

        setUpcomingSessions(
          sessions
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        Swal.fire("Error", "Failed to load mentor dashboard data.", "error");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.email]);

  // 🔄 Loading state
  if (loading || dashboardLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-300 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
          Loading your mentor dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* 👋 Welcome Banner */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.displayName || "Mentor"} 👋
            </h1>
            <p className="text-gray-300 text-sm">
              Here’s a quick summary of your mentorship activities.
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-gray-400 opacity-60" />
        </div>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Pending Requests"
          value={stats.pending}
          color="from-yellow-400 to-yellow-600"
          icon={Clock}
        />
        <StatCard
          label="Approved Requests"
          value={stats.approved}
          color="from-green-400 to-green-600"
          icon={CheckCircle}
        />
        <StatCard
          label="Rejected Requests"
          value={stats.rejected}
          color="from-red-400 to-red-600"
          icon={MessageSquare}
        />
        <StatCard
          label="Scheduled Sessions"
          value={stats.scheduled}
          color="from-blue-400 to-blue-600"
          icon={CalendarDays}
        />
      </div>

      {/* 📨 Recent Session Requests */}
      <DataSection
        title="Recent Session Requests"
        emptyText="No recent requests found."
        items={recentRequests}
        renderItem={(req) => (
          <>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {req.title}
              </p>
              <p className="text-sm text-gray-500">{req.menteeEmail}</p>
            </div>
            <span
              className={`px-3 py-1 text-xs rounded-full ${
                req.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : req.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {req.status}
            </span>
          </>
        )}
      />

      {/* 📅 Upcoming Sessions */}
      <DataSection
        title="Upcoming Scheduled Sessions"
        emptyText="No upcoming sessions yet."
        items={upcomingSessions}
        renderItem={(s) => (
          <>
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {s.comment || "Mentorship Session"}
              </p>
              <p className="text-sm text-gray-500">
                <a
                  href={s.sessionLink}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Join Session
                </a>
              </p>
            </div>
            <p className="text-sm text-gray-500">
              {new Date(s.createdAt).toLocaleDateString()}
            </p>
          </>
        )}
      />
    </div>
  );
};

/* ✅ Reusable StatCard Component */
const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
    <div
      className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
  </div>
);

/* ✅ Reusable Data Section Component */
const DataSection = ({ title, emptyText, items, renderItem }) => (
  <section>
    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      {title}
    </h2>
    {items.length === 0 ? (
      <p className="text-gray-500 text-center py-6">{emptyText}</p>
    ) : (
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 p-4 last:border-b-0"
          >
            {renderItem(item)}
          </div>
        ))}
      </div>
    )}
  </section>
);

export default MentorOverview;
