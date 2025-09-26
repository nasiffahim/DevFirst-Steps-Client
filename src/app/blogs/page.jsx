'use client';
import React, { useState, useEffect } from 'react';
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
  PenTool,
  FileText
} from 'lucide-react';
import axios from 'axios';
import api from '../../utils/api';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBlog, setExpandedBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      // Replace with your actual API endpoint
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

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const toggleExpanded = (blogId) => {
    setExpandedBlog(expandedBlog === blogId ? null : blogId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading all the amazing blogs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchBlogs}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <PenTool className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Blog</h1>
          <p className="text-gray-600 text-lg">Sharing thoughts, insights, and experiences</p>
          <div className="flex items-center justify-center mt-4">
            <FileText className="w-5 h-5 text-purple-500 mr-2" />
            <span className="text-gray-700 font-medium">{blogs.length} Articles Published</span>
          </div>
        </div>

        {/* Blogs List */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No blogs yet</h3>
            <p className="text-gray-500">Start writing your first blog post!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="md:flex">
                  {/* Thumbnail */}
                  <div className="md:w-1/3 lg:w-1/4">
                    {blog.thumbnail ? (
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-64 md:h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-64 md:h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center ${blog.thumbnail ? 'hidden' : 'flex'}`}
                    >
                      <BookOpen className="w-16 h-16 text-white opacity-50" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8">
                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight hover:text-purple-600 transition-colors cursor-pointer">
                      {blog.title}
                    </h2>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span className="font-medium">{blog.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{getReadingTime(blog.content)}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {blog.tags && (
                      <div className="flex items-center mb-4">
                        <Tag className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.split(' ').filter(tag => tag.trim()).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content Preview */}
                    <div className="text-gray-600 leading-relaxed mb-6">
                      <p className="text-base">
                        {expandedBlog === blog._id 
                          ? blog.content 
                          : truncateContent(blog.content, 200)
                        }
                      </p>
                      {blog.content.length > 200 && (
                        <button
                          onClick={() => toggleExpanded(blog._id)}
                          className="text-purple-600 hover:text-purple-800 font-medium mt-2 inline-flex items-center"
                        >
                          {expandedBlog === blog._id ? 'Read Less' : 'Read More'}
                          <Eye className="w-4 h-4 ml-1" />
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-gray-500 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5 mr-1" />
                          <span className="text-sm">Like</span>
                        </button>
                        <button className="flex items-center text-gray-500 hover:text-blue-500 transition-colors">
                          <Share2 className="w-5 h-5 mr-1" />
                          <span className="text-sm">Share</span>
                        </button>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105">
                        Read Full Article
                      </button>
                    </div>
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