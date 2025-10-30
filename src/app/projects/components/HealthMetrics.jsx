"use client";
import { useState, useEffect } from "react";
import api from "../../../utils/api";

const HealthMetrics = ({ project }) => {
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [healthError, setHealthError] = useState("");

  useEffect(() => {
    if (project) {
      fetchHealthMetrics();
    }
  }, [project]);

  const fetchHealthMetrics = async () => {
    if (healthData || healthLoading) return;

    try {
      setHealthLoading(true);
      setHealthError("");

      const owner = project.owner?.login;
      const repo = project.name;

      const response = await api.get(`/health/${owner}/${repo}`);
      setHealthData(response.data);
    } catch (err) {
      console.error("Error fetching health metrics:", err);
      setHealthError("Failed to load health metrics. Please try again.");
    } finally {
      setHealthLoading(false);
    }
  };

  const getHealthColor = (healthLevel) => {
    if (healthLevel.includes("🟢")) return "bg-green-500";
    if (healthLevel.includes("🟡")) return "bg-yellow-500";
    if (healthLevel.includes("🟠")) return "bg-orange-500";
    return "bg-red-500";
  };

  if (healthLoading) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Analyzing Repository Health...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This may take a few moments as we analyze multiple metrics
          </p>
        </div>
      </div>
    );
  }

  if (healthError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8">
        <div className="text-center">
          <div className="text-red-500 dark:text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
            Error Loading Health Metrics
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-6">{healthError}</p>
          <button
            onClick={() => {
              setHealthData(null);
              setHealthError("");
              fetchHealthMetrics();
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!healthData) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Overall Health Card */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {healthData.owner}/{healthData.repo}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Repository Health Analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`w-4 h-4 rounded-full ${getHealthColor(
                healthData.healthLevel
              )}`}
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {healthData.healthLevel}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center py-8 border-t border-b border-gray-100 dark:border-slate-700">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${
                    (healthData.overallHealth / 100) * 351.858
                  } 351.858`}
                  className={`${
                    healthData.overallHealth >= 80
                      ? "text-green-500"
                      : healthData.overallHealth >= 60
                      ? "text-yellow-500"
                      : healthData.overallHealth >= 40
                      ? "text-orange-500"
                      : "text-red-500"
                  } transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {healthData.overallHealth}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Health Score
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
            <div className="text-yellow-600 dark:text-yellow-400 text-2xl mb-2">
              ⭐
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              +{healthData.metrics.starGrowth30d}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Stars (30d)
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="text-purple-600 dark:text-purple-400 text-2xl mb-2">
              🍴
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              +{healthData.metrics.forkGrowth30d}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Forks (30d)
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="text-blue-600 dark:text-blue-400 text-2xl mb-2">
              👥
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {healthData.metrics.activeMaintainers}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Maintainers
            </div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="text-green-600 dark:text-green-400 text-2xl mb-2">
              📈
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {healthData.metrics.contributorRetention}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Retention Rate
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Response Time */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Issue Response Time
            </h3>
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {healthData.metrics.avgIssueResponseTime}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average response time
              </p>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Score: {healthData.breakdown.responseTimeScore}/100
                </span>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  style={{
                    width: `${healthData.breakdown.responseTimeScore}%`,
                  }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    healthData.breakdown.responseTimeScore >= 80
                      ? "bg-green-500"
                      : healthData.breakdown.responseTimeScore >= 60
                      ? "bg-yellow-500"
                      : healthData.breakdown.responseTimeScore >= 40
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Based on {healthData.dataPoints.issuesAnalyzed} recent issues
            </p>
          </div>
        </div>

        {/* Merge Speed */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              PR Merge Speed
            </h3>
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {healthData.metrics.avgPRMergeTime}h
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average merge time
              </p>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Score: {healthData.breakdown.mergeSpeedScore}/100
                </span>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  style={{
                    width: `${healthData.breakdown.mergeSpeedScore}%`,
                  }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                    healthData.breakdown.mergeSpeedScore >= 80
                      ? "bg-green-500"
                      : healthData.breakdown.mergeSpeedScore >= 60
                      ? "bg-yellow-500"
                      : healthData.breakdown.mergeSpeedScore >= 40
                      ? "bg-orange-500"
                      : "bg-red-500"
                  }`}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Based on {healthData.dataPoints.prsAnalyzed} merged PRs
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Health Breakdown */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Health Metrics Breakdown
        </h3>
        <div className="space-y-6">
          {/* Response Time Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Response Time Score
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {healthData.breakdown.responseTimeScore}/100
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{
                  width: `${healthData.breakdown.responseTimeScore}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-green-600"
              ></div>
            </div>
          </div>

          {/* Merge Speed Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Merge Speed Score
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {healthData.breakdown.mergeSpeedScore}/100
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{
                  width: `${healthData.breakdown.mergeSpeedScore}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-400 to-blue-600"
              ></div>
            </div>
          </div>

          {/* Growth Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Growth Score
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {healthData.breakdown.growthScore}/100
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{
                  width: `${healthData.breakdown.growthScore}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-400 to-purple-600"
              ></div>
            </div>
          </div>

          {/* Contributor Retention */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Contributor Retention
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {healthData.breakdown.retentionScore}/100
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{
                  width: `${healthData.breakdown.retentionScore}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-400 to-yellow-600"
              ></div>
            </div>
          </div>

          {/* Maintainer Activity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Maintainer Activity
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {healthData.breakdown.maintainerScore}/100
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{
                  width: `${healthData.breakdown.maintainerScore}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-red-400 to-red-600"
              ></div>
            </div>
          </div>

          {/* Update Frequency */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-cyan-600 dark:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Update Frequency
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {healthData.breakdown.updateFrequencyScore}/100
              </span>
            </div>
            <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                style={{
                  width: `${healthData.breakdown.updateFrequencyScore}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-cyan-400 to-cyan-600"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Contributors
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {healthData.metrics.totalContributors}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Commits (30d)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {healthData.metrics.commitsLast30Days}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Avg Commits/Week
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {healthData.metrics.avgCommitsPerWeek}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Card */}
      <div
        className={`border rounded-2xl p-8 ${
          healthData.overallHealth >= 80
            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
            : healthData.overallHealth >= 60
            ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
            : healthData.overallHealth >= 40
            ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
            : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        }`}
      >
        <div className="flex gap-4">
          <svg
            className={`w-6 h-6 flex-shrink-0 mt-0.5 ${
              healthData.overallHealth >= 80
                ? "text-green-600 dark:text-green-400"
                : healthData.overallHealth >= 60
                ? "text-yellow-600 dark:text-yellow-400"
                : healthData.overallHealth >= 40
                ? "text-orange-600 dark:text-orange-400"
                : "text-red-600 dark:text-red-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4
              className={`font-bold text-lg mb-2 ${
                healthData.overallHealth >= 80
                  ? "text-green-900 dark:text-green-300"
                  : healthData.overallHealth >= 60
                  ? "text-yellow-900 dark:text-yellow-300"
                  : healthData.overallHealth >= 40
                  ? "text-orange-900 dark:text-orange-300"
                  : "text-red-900 dark:text-red-300"
              }`}
            >
              Recommendation
            </h4>
            <p
              className={`text-sm ${
                healthData.overallHealth >= 80
                  ? "text-green-800 dark:text-green-400"
                  : healthData.overallHealth >= 60
                  ? "text-yellow-800 dark:text-yellow-400"
                  : healthData.overallHealth >= 40
                  ? "text-orange-800 dark:text-orange-400"
                  : "text-red-800 dark:text-red-400"
              }`}
            >
              {healthData.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Health Bar Visual */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Repository Health Bar
        </h3>
        <div className="relative">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Critical</span>
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Excellent</span>
          </div>
          <div className="relative h-8 bg-gradient-to-r from-red-500 via-yellow-500 via-blue-500 to-green-500 rounded-full">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-gray-900 dark:border-white rounded-full shadow-lg transition-all duration-500"
              style={{
                left: `calc(${healthData.overallHealth}% - 8px)`,
              }}
            />
          </div>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This repository scores{" "}
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {healthData.overallHealth}/100
              </span>{" "}
              on the health scale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;