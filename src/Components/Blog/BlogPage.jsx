'use client'
import React from "react";
import BlogCard from "./BlogCard";
const blogs = [
  {
    _id: "1",
    title: "How to Start Contributing to Open Source",
    author: "Admin",
    date: "2025-09-16",
    content: "Open source contribution is a great way to learn...",
    thumbnail:
      "https://i.ibb.co.com/d4HftJKf/Howto-Get-Started-With-Open-Source-Contribution.png",
  },
  {
    _id: "2",
    title: "Top 10 Beginner Friendly Repos",
    author: "Hasan",
    date: "2025-09-12",
    content: "Here is a curated list of GitHub repos...",
    thumbnail: "https://i.ibb.co.com/h1BJ36Yz/images-3.jpg",
  },
  {
    _id: "3",
    title: "Why You Should Contribute to Open Source",
    author: "Guest Writer",
    date: "2025-09-10",
    content: "Contributing to open source not only helps projects...",
    thumbnail: "https://i.ibb.co.com/Q7LWJmSW/download-7.jpg",
  },
];

const BlogPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[80vh] py-16 transition-colors duration-300">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center">
          {/* Header Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6 transition-colors duration-300">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            Latest Articles
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            DevFirst Steps Blog
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
            Stay updated with the latest tips, tutorials, and insights about
            open source development. Learn from experienced developers and
            discover new ways to contribute to the community.
          </p>

          {/* Blog Stats */}
          <div className="flex justify-center items-center mt-8 space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                {blogs.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Articles</div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 transition-colors duration-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">3</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Authors</div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600 transition-colors duration-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">Weekly</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Updates</div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={blog._id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default BlogPage;
