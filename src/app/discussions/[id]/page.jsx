"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Comments } from "../../../Components/shared/Comments";
import { VoteButtons } from "../../../Components/shared/VoteButtons";
import {
  Star,
  MessageCircle,
  Clock,
  CheckCircle,
  Tag,
  TrendingUp,
} from "lucide-react";
import api from "../../../utils/api";

export default function DiscussionDetails() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);

  useEffect(() => {
    const fetchDiscussion = async () => {
      try {
        const { data } = await api.get(
          `/api/discussions/${id}`
        );
        setDiscussion(data);
      } catch (err) {
        console.error("Error fetching discussion:", err);
      }
    };
    fetchDiscussion();
  }, [id]);

  if (!discussion) {
    return <p className="text-center text-gray-500">Loading discussion...</p>;
  }

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 border border-gray-300 dark:border-gray-600 rounded-lg">
        <div className="space-y-4">
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
                <div className="block group/title">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-2">
                    {discussion.title}
                  </h2>
                </div>

                {/* Author and Time */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                    {discussion.author.name}
                  </span>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
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

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Created at{" "}
                      {new Date(discussion.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <Comments discussionId={discussion._id} />
        </div>
      </div>
    </section>
  );
}
