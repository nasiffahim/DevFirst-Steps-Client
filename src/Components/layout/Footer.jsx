"use client";

import React from 'react';
import { Github, Twitter, Linkedin, Mail, Heart, Code, Users, Star, ExternalLink } from 'lucide-react';
import { usePathname } from "next/navigation";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const techStacks = [
    { name: 'Web Development', count: '150+' },
    { name: 'Mobile Apps', count: '80+' },
    { name: 'AI/ML', count: '60+' },
    { name: 'Game Development', count: '45+' },
    { name: 'DevOps', count: '70+' },
    { name: 'Backend', count: '90+' }
  ];

  const quickLinks = [
    'Browse Projects',
    'Submit Project',
    'Guidelines',
    'Community'
  ];

  const resources = [
    'Documentation',
    'API Reference',
    'Tutorials',
    'Blog'
  ];
if (isDashboard) return null;
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white dark:text-gray-100 transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-lg flex items-center justify-center transition-colors duration-300">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white dark:text-gray-100 transition-colors duration-300">DevFirst Steps</h3>
            </div>
            <p className="text-gray-400 dark:text-gray-300 text-sm leading-relaxed mb-6 transition-colors duration-300">
              Discover, contribute, and learn from the best open source projects. Connect with a community of passionate developers building the future.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-200 group">
                <Github className="w-5 h-5 text-gray-400 dark:text-gray-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-200 group">
                <FaXTwitter className="w-5 h-5 text-gray-400 dark:text-gray-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-blue-700 dark:hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 group">
                <Linkedin className="w-5 h-5 text-gray-400 dark:text-gray-300 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-500 rounded-lg flex items-center justify-center transition-all duration-200 group">
                <Mail className="w-5 h-5 text-gray-400 dark:text-gray-300 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white dark:text-gray-100 transition-colors duration-300">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors duration-200 flex items-center gap-2 group">
                    <span>{link}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white dark:text-gray-100 transition-colors duration-300">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors duration-200 flex items-center gap-2 group">
                    <span>{resource}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stacks */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white dark:text-gray-100 transition-colors duration-300">Categories</h4>
            <div className="grid grid-cols-1 gap-2">
              {techStacks.map((stack, index) => (
                <div key={index} className="flex items-center justify-between py-1">
                  <span className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">{stack.name}</span>
                  <span className="text-xs bg-gray-800 dark:bg-gray-700 text-gray-300 dark:text-gray-200 px-2 py-1 rounded-full transition-colors duration-300">{stack.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-700 transition-colors duration-300">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-2 text-white dark:text-gray-100 transition-colors duration-300">Stay Updated</h4>
            <p className="text-gray-400 dark:text-gray-300 text-sm mb-4 transition-colors duration-300">Get notified about new projects and features</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-lg text-white dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-700 transition-colors duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="group">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Code className="w-5 h-5 text-blue-500 dark:text-blue-400 transition-colors duration-300" />
                <span className="text-2xl font-bold text-white dark:text-gray-100 transition-colors duration-300">500+</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">Open Source Projects</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-500 dark:text-green-400 transition-colors duration-300" />
                <span className="text-2xl font-bold text-white dark:text-gray-100 transition-colors duration-300">12K+</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">Active Developers</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 transition-colors duration-300" />
                <span className="text-2xl font-bold text-white dark:text-gray-100 transition-colors duration-300">50K+</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">GitHub Stars</p>
            </div>
            <div className="group">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-500 dark:text-red-400 transition-colors duration-300" />
                <span className="text-2xl font-bold text-white dark:text-gray-100 transition-colors duration-300">25K+</span>
              </div>
              <p className="text-gray-400 dark:text-gray-300 text-sm transition-colors duration-300">Contributors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 dark:border-gray-700 bg-gray-950 dark:bg-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-300 transition-colors duration-300">
              <span>© 2024 OpenSource Hub.</span>
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 dark:text-red-400 fill-current transition-colors duration-300" />
              <span>by the community</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;