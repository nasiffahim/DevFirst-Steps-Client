"use client";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  Eye,
  Hash,
  MessageCircle,
  MessageSquare,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const CommunityDiscussions = () => {
  const [hoveredDiscussion, setHoveredDiscussion] = useState(null);

  const discussions = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        avatar: "👩‍💻",
        role: "Senior Developer",
        reputation: 2847,
      },
      title: "Best practices for implementing JWT authentication in Next.js?",
      preview:
        "I've been working on a new project and wondering what's the current best approach for handling JWT tokens in Next.js 14. Should I use server components or...",
      category: "Authentication",
      votes: { up: 42, down: 3 },
      replies: 23,
      views: 1247,
      timestamp: "2 hours ago",
      status: "active",
      tags: ["Next.js", "JWT", "Authentication"],
      isHot: true,
      lastActivity: "Alex replied 5 minutes ago",
    },
    {
      id: 2,
      author: {
        name: "Mike Rodriguez",
        avatar: "👨‍🔬",
        role: "Full Stack Engineer",
        reputation: 1893,
      },
      title:
        "Database optimization strategies that improved our API response by 60%",
      preview:
        "After months of performance issues, we finally cracked it! Here's a detailed breakdown of the optimization techniques we used including indexing strategies...",
      category: "Performance",
      votes: { up: 89, down: 2 },
      replies: 31,
      views: 3421,
      timestamp: "5 hours ago",
      status: "solved",
      tags: ["Database", "Optimization", "Performance"],
      isHot: true,
      lastActivity: "Emma reacted 12 minutes ago",
    },
    {
      id: 3,
      author: {
        name: "Emily Johnson",
        avatar: "👩‍🎨",
        role: "UI/UX Designer",
        reputation: 1654,
      },
      title:
        "Accessibility-first design system: Complete guide with React components",
      preview:
        "Creating inclusive digital experiences shouldn't be an afterthought. This comprehensive guide covers everything from color contrast to screen reader...",
      category: "Design System",
      votes: { up: 67, down: 1 },
      replies: 18,
      views: 2156,
      timestamp: "1 day ago",
      status: "featured",
      tags: ["Accessibility", "Design System", "React"],
      isHot: false,
      lastActivity: "Discussion trending",
    },
  ];

  const communityStats = [
    {
      icon: MessageSquare,
      label: "Active Discussions",
      value: "1,247",
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "Community Members",
      value: "12,430",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Questions Answered",
      value: "8,965",
      color: "text-purple-600",
    },
    {
      icon: CheckCircle,
      label: "Solutions Found",
      value: "94%",
      color: "text-orange-600",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "active":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case "featured":
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      solved: "Solved",
      active: "Active",
      featured: "Featured",
    };
    return labels[status] || "Open";
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950/30 dark:to-indigo-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800">
            <MessageSquare className="w-4 h-4" />
            Live Community Activity
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Thriving Developer Community
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get answers, share knowledge, and connect with thousands of
            developers solving real-world problems
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700"
            >
              <div
                className={`inline-flex p-3 rounded-xl bg-gray-50 dark:bg-gray-700 ${stat.color} mb-4`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Discussions */}
        <div className="space-y-6 mb-12">
          {discussions.map((discussion, index) => (
            <div
              key={discussion.id}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/25 transition-all duration-300 overflow-hidden ${
                hoveredDiscussion === discussion.id
                  ? "border-blue-200 dark:border-blue-600 shadow-lg"
                  : ""
              }`}
              onMouseEnter={() => setHoveredDiscussion(discussion.id)}
              onMouseLeave={() => setHoveredDiscussion(null)}
            >
              <div className="p-6">
                {/* Discussion Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl border-2 border-white dark:border-gray-600 shadow-sm">
                      {discussion.author.avatar}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        {discussion.title}
                      </h3>
                      {discussion.isHot && (
                        <span className="inline-flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded-full text-xs font-medium border border-red-200 dark:border-red-800">
                          🔥 Hot
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">
                          {discussion.author.name}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500">•</span>
                        <span>{discussion.author.role}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>
                          {discussion.author.reputation.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                      {discussion.preview}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(discussion.status)}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getStatusLabel(discussion.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs">
                    <Hash className="w-3 h-3" />
                    {discussion.category}
                  </div>
                  {discussion.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Discussion Metrics */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </button>
                        <span className="mx-1 font-medium text-gray-900 dark:text-white">
                          {discussion.votes.up - discussion.votes.down}
                        </span>
                        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <ArrowDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{discussion.replies} replies</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{discussion.views.toLocaleString()} views</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{discussion.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {discussion.lastActivity}
                    </span>
                    <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm">
                      Join Discussion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Join the Conversation?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect with developers, share your expertise, and get help with
              your projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Ask a Question
              </button>
              <button className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-semibold">
                Browse All Discussions
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
