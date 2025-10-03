"use client";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Star,
  MessageCircle,
  Clock,
  CheckCircle,
  Eye,
  Tag,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import axios from "axios";
import useAuth from "../../app/hooks/useAuth";
import { Comments } from "../shared/Comments";
import { VoteButtons } from "../shared/VoteButtons";
import Link from "next/link";
import { CommunityStats } from "../shared/CommunityStats";

// Main Community Discussions
export const CommunityDiscussions = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [hoveredDiscussion, setHoveredDiscussion] = useState(null);
  const [commentCounts, setCommentCounts] = useState({}); // store total comment count

  useEffect(() => {
    const fetchData = async () => {
      try {
        // discussions   check user  current check update match
        const { data: discussionData } = await axios.get(
          "http://localhost:5000/api/top-discussions"
        );
        setDiscussions(discussionData);

        // Fetch comment counts
        const countsPromises = discussionData.map(async (d) => {
          const res = await axios.get(
            `http://localhost:5000/api/comments/${d._id}`
          );
          const comments = res.data || [];
          const count = comments.reduce(
            (acc, comment) =>
              acc +
              1 +
              (Array.isArray(comment.replies) ? comment.replies.length : 0),
            0
          );
          return { id: d._id, count };
        });

        const countsArray = await Promise.all(countsPromises);
        const countsObj = {};
        countsArray.forEach((c) => (countsObj[c.id] = c.count));
        setCommentCounts(countsObj);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 1000); // refresh every 1 second
    return () => clearInterval(interval); // cleanup
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "active":
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case "featured":
        return <Star className="w-5 h-5 text-yellow-500" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "solved":
        return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "active":
        return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "featured":
        return "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
      default:
        return "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      if (hours < 1) {
        const minutes = Math.floor(diffInMs / (1000 * 60));
        return `${minutes}m ago`;
      }
      return `${hours}h ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800">
            <MessageSquare className="w-4 h-4" />
            Live Community Activity
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Share Your Thought's in Developers Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get answers, share knowledge, and connect with thousands of
            developers solving real-world problems
          </p>
        </div>

        <CommunityStats /> 

        {/* Discussions List */}
        <div className="space-y-4">
          {discussions.length > 0 ? (
            discussions.map((discussion) => (
              <div
                key={discussion._id}
                className={`group relative rounded-xl border ${
                  hoveredDiscussion === discussion._id
                    ? "border-blue-300 dark:border-blue-700 shadow-lg"
                    : "border-gray-200 dark:border-gray-800 shadow-sm"
                } hover:shadow-xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-900`}
                onMouseEnter={() => setHoveredDiscussion(discussion._id)}
                onMouseLeave={() => setHoveredDiscussion(null)}
              >
                {/* Status Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                      discussion.status
                    )}`}
                  >
                    {getStatusIcon(discussion.status)}
                    <span className="capitalize">{discussion.status}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-5">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {discussion.author.avatar ? (
                        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                          <img
                            src={discussion.author.avatar}
                            alt={discussion.author.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white ring-2 ring-gray-200 dark:ring-gray-700">
                          {discussion.author.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <Link
                        href={`/discussions/${discussion._id}`}
                        className="block group/title"
                      >
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-2">
                          {discussion.title}
                        </h2>
                      </Link>

                      {/* Author and Time */}
                      <div className="flex items-center gap-2 mb-6">
                        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {discussion.author.name}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">
                          •
                        </span>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{formatTimestamp(discussion.timestamp)}</span>
                        </div>
                      </div>

                      {/* Preview */}
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
                        {discussion.content}
                      </p>

                      {/* Category and Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          <Tag className="w-3 h-3" />
                          {discussion.category}
                        </span>
                        {discussion.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Metrics */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        {/* Left side metrics */}
                        <div className="flex items-center gap-6">
                          {/* Vote Buttons */}
                          <VoteButtons
                            discussionId={discussion._id}
                            initialVotes={discussion.votes}
                            initialUserVote={discussion.userVote}
                          />

                          {/* Replies */}
                          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-medium">
                              {commentCounts[discussion._id] || 0}
                            </span>
                            <span className="hidden sm:inline">
                              {commentCounts[discussion._id] === 1
                                ? "reply"
                                : "replies"}
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Created at{" "}
                            {new Date(discussion.timestamp).toLocaleString()}
                          </div>
                        </div>

                        {/* Join Discussion Button */}
                        <Link
                          href={`/discussions/${discussion._id}`}
                          className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md group/button"
                        >
                          <span>Join Discussion</span>
                          <MessageCircle className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover effect border */}
                <div
                  className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
                    hoveredDiscussion === discussion._id
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)",
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">
                No discussions yet
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Be the first to start a conversation!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
