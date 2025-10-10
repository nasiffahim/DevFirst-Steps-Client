'use client';

import Link from "next/link";
import React, { useState, useEffect } from 'react';
import api from "../../../utils/api"
import { 
  BookOpen, 
  Calendar, 
  User, 
  Tag, 
  Eye, 
  Heart,
  Share2,
  Clock,
  Loader2,
  AlertCircle,
  RefreshCw,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';


const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/all-blogs');
      setBlogs(response.data);
    } catch (err) {
      setError('Failed to fetch blogs. Please try again.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);
  console.log("blog", blogs)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const truncateContent = (content, maxLength = 120) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const toggleExpanded = (blogId) => {
    setExpandedBlog(expandedBlog === blogId ? null : blogId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-gray-600 dark:text-gray-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 max-w-md w-full text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 text-lg mb-6">{error}</p>
              <button
                onClick={fetchBlogs}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
              Blog Articles
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Exploring ideas, sharing insights, and documenting the journey
            </p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {blogs.length} {blogs.length === 1 ? 'Article' : 'Articles'} Published
              </span>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No blogs yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start writing your first blog post!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full"
              >
                {/* Thumbnail */}
                <div className="relative w-full h-48 flex-shrink-0">
                  {blog.thumbnail ? (
                    <img
                      src={blog.thumbnail}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center ${blog.thumbnail ? 'hidden' : 'flex'}`}
                  >
                    <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Author  */}
                  <div>
                   <h2 className="flex items-center gap-2">
                    Author Photo :{" "}
                    <img
                      className=" w-12 rounded-full"
                      src={blog.AuthorPhoto}
                      alt=""
                    />
                  </h2>
                    <h2>Author Name : {blog.AuthorName}</h2>
                    <h2>Author Email : {blog.AuthorEmail}</h2>
                  </div>
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer line-clamp-2">
                    {blog.title}
                  </h2>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1" />
                      <span className="font-medium">{blog.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span>{getReadingTime(blog.content)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {blog.tags && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {blog.tags.split(' ').filter(tag => tag.trim()).slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                          >
                            <Tag className="w-2.5 h-2.5 mr-1" />
                            {tag.trim()}
                          </span>
                        ))}
                        {blog.tags.split(' ').filter(tag => tag.trim()).length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-1 text-gray-500 dark:text-gray-400 text-xs">
                            +{blog.tags.split(' ').filter(tag => tag.trim()).length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4 flex-grow">
                    <p className="text-sm whitespace-pre-line">
                      {expandedBlog === blog._id 
                        ? blog.content 
                        : truncateContent(blog.content, 120)
                      }
                    </p>
                    {blog.content.length > 120 && (
                      <button
                        onClick={() => toggleExpanded(blog._id)}
                        className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium mt-2 inline-flex items-center group text-sm"
                      >
                        {expandedBlog === blog._id ? (
                          <>
                            Show Less
                            <ChevronUp className="w-3.5 h-3.5 ml-1 group-hover:-translate-y-0.5 transition-transform" />
                          </>
                        ) : (
                          <>
                            Read More
                            <ChevronDown className="w-3.5 h-3.5 ml-1 group-hover:translate-y-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                    <div className="flex items-center gap-3">
                      <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group">
                        <Heart className="w-4 h-4 group-hover:fill-current" />
                      </button>
                      <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Link
  href={`/my-blogs/${blog._id}`}
  className="px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
>
  Read Full
</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;