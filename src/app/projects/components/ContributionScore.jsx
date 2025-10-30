"use client";
import { useState, useEffect } from "react";
import api from "../../../utils/api";
import useAuth from "../../hooks/useAuth";

const ContributionScore = ({ project, username: propsUsername }) => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [visitorUsername, setVisitorUsername] = useState("");
  const [tempUsername, setTempUsername] = useState("");

  console.log("user info:", user);

  // Determine the effective username to use
  const effectiveUsername = propsUsername || visitorUsername;

  useEffect(() => {
    if (effectiveUsername && project) {
      fetchContributionScore();
    }
  }, [effectiveUsername, project]);

  const fetchContributionScore = async () => {
    try {
      setLoading(true);
      setError("");

      const owner = project.owner?.login;
      const repo = project.name;

      console.log("API Call:", { owner, repo, username: effectiveUsername });

      const response = await api.get(
        `/contribution-score/${owner}/${repo}/${effectiveUsername}`
      );
      
      if (response.data && response.data.isContributor === false) {
        setScoreData(response.data);
      } else {
        setScoreData(response.data);
      }
    } catch (err) {
      console.error("Error fetching contribution score:", err);
      setError("Failed to load contribution score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      setVisitorUsername(tempUsername.trim());
    }
  };

  const handleResetUsername = () => {
    setVisitorUsername("");
    setTempUsername("");
    setScoreData(null);
    setError("");
  };

  // Show username prompt for visitors without username
  if (!user && !effectiveUsername) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Check Your Contribution Score
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Enter your GitHub username to see your contribution metrics for this repository
          </p>
          
          <form onSubmit={handleVisitorSubmit} className="max-w-md mx-auto space-y-4">
            <div>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter your GitHub username"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                required
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-left">
                Just the username (e.g., "octocat" not "https://github.com/octocat")
              </p>
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analyze My Contributions
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md mx-auto">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">💡</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Want to save your username?
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Create an account to automatically track your contributions across all projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show username prompt for logged-in users without username
  if (user && !propsUsername) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            GitHub Username Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Please add your GitHub profile URL in your profile settings to see your contribution score.
          </p>
          <button
            onClick={() => window.location.href = "/dashboard/edit-profile"}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Go to Profile Settings
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Analyzing Your Contributions...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <div className="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">
            {error}
          </h3>
          <div className="flex gap-3 justify-center mt-4">
            <button
              onClick={fetchContributionScore}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium"
            >
              Try Again
            </button>
            {!user && visitorUsername && (
              <button
                onClick={handleResetUsername}
                className="px-6 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 font-medium border border-gray-200 dark:border-slate-600"
              >
                Change Username
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return null;
  }

  // Show special "No Contributions" view if user hasn't contributed
  if (scoreData.isContributor === false) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-8">
        <div className="text-center py-12">
          {!user && visitorUsername && (
            <div className="mb-4 flex justify-center">
              <button
                onClick={handleResetUsername}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Change username
              </button>
            </div>
          )}
          <div className="text-8xl mb-6">{scoreData.badge}</div>
          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            {scoreData.impactLevel}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            {scoreData.message}
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <strong className="text-blue-600 dark:text-blue-400">💡 Get Started:</strong> {scoreData.recommendation}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-3xl mb-2">🔀</div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Create a PR</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Submit your first pull request</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-3xl mb-2">🐛</div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Report Issues</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Help identify bugs or improvements</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <div className="text-3xl mb-2">👁️</div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">Review Code</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Provide feedback on others' PRs</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => window.open(`https://github.com/${scoreData.owner}/${project.name}`, '_blank')}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Visit Repository on GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Show username change option for visitors */}
      {!user && visitorUsername && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Viewing contributions for: <strong className="text-blue-600 dark:text-blue-400">@{visitorUsername}</strong>
            </p>
            <button
              onClick={handleResetUsername}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Change username
            </button>
          </div>
        </div>
      )}

      {/* Overall Score Card */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-6 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">{scoreData.badge}</span>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {scoreData.impactLevel}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{scoreData.username}
                </p>
              </div>
            </div>
          </div>
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
                    (scoreData.overallScore / 100) * 351.858
                  } 351.858`}
                  className={`${
                    scoreData.overallScore >= 80
                      ? "text-green-500"
                      : scoreData.overallScore >= 65
                      ? "text-blue-500"
                      : scoreData.overallScore >= 50
                      ? "text-yellow-500"
                      : scoreData.overallScore >= 30
                      ? "text-orange-500"
                      : "text-red-500"
                  } transition-all duration-1000`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {scoreData.overallScore}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Impact Score
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 mt-4">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Recommendation:</strong> {scoreData.recommendation}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
              🔀
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scoreData.summary.mergedPRs}/{scoreData.summary.totalPRs}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Merged PRs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl">
              🐛
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scoreData.summary.issuesResolved}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Issues Resolved
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl">
              👁️
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scoreData.summary.reviewsGiven}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Reviews Given
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center text-white text-xl">
              📝
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scoreData.summary.totalCommits}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Total Commits
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xl">
              📂
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scoreData.summary.issuesOpened}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Issues Opened
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-xl">
              ✅
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.prQuality.mergeRate}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                PR Merge Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Detailed Breakdown
        </h3>

        {/* PR Quality */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
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
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                  Pull Request Quality
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Weight: {scoreData.metrics.prQuality.weight}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {scoreData.breakdown.prQualityScore}/100
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              style={{
                width: `${scoreData.breakdown.prQualityScore}%`,
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-400 to-blue-600"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Merge Rate</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.prQuality.mergeRate}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Total PRs</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.prQuality.totalPRs}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Avg Reviews/PR
              </p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.prQuality.avgReviewsPerPR}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Code Changes</p>
              <p className="font-bold text-green-600 dark:text-green-400">
                +{scoreData.metrics.prQuality.totalAdditions}
              </p>
              <p className="font-bold text-red-600 dark:text-red-400">
                -{scoreData.metrics.prQuality.totalDeletions}
              </p>
            </div>
          </div>
        </div>

        {/* Issue Management */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                  Issue Management
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Weight: {scoreData.metrics.issueManagement.weight}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {scoreData.breakdown.issueScore}/100
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              style={{
                width: `${scoreData.breakdown.issueScore}%`,
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-400 to-green-600"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Resolution Rate
              </p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.issueManagement.resolutionRate}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Opened</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.issueManagement.issuesOpened}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Closed</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.issueManagement.issuesClosed}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.issueManagement.issuesResolved}
              </p>
            </div>
          </div>
        </div>

        {/* Review Participation */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                  Code Review Participation
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Weight: {scoreData.metrics.reviewParticipation.weight}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {scoreData.breakdown.reviewScore}/100
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              style={{
                width: `${scoreData.breakdown.reviewScore}%`,
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-400 to-purple-600"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Reviews Given
              </p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.reviewParticipation.reviewsGiven}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Approvals</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.reviewParticipation.approvalsGiven}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Changes Requested
              </p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.reviewParticipation.changesRequested}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Comments</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.reviewParticipation.commentsGiven}
              </p>
            </div>
          </div>
        </div>

        {/* Commit Quality */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100">
                  Commit Quality
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Weight: {scoreData.metrics.commitQuality.weight}
                </p>
              </div>
            </div>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {scoreData.breakdown.commitScore}/100
            </span>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              style={{
                width: `${scoreData.breakdown.commitScore}%`,
              }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-yellow-400 to-yellow-600"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Total Commits
              </p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.commitQuality.totalCommits}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Meaningful</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.commitQuality.meaningfulCommits}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Quality Rate</p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.commitQuality.meaningfulRate}%
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">
                Avg Files/Commit
              </p>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {scoreData.metrics.commitQuality.avgFilesPerCommit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributionScore;