"use client";
import { useState } from "react";
import {
  Globe,
  Smartphone,
  Apple,
  Brain,
  Network,
  Database,
  Cloud,
  Gamepad2,
  Code,
  Settings,
} from "lucide-react";
import { techStacks } from "../shared/techStacks";

const TechStackSection = () => {
  const [activeTab, setActiveTab] = useState("web");

  const tabs = [
    { id: "web", label: "Web", icon: Globe },
    { id: "android", label: "Android", icon: Smartphone },
    { id: "ios", label: "iOS", icon: Apple },
    { id: "ai", label: "AI/ML", icon: Brain },
    { id: "networking", label: "Networking", icon: Network },
    { id: "database", label: "Database", icon: Database },
    { id: "cloud", label: "Cloud", icon: Cloud },
    { id: "gaming", label: "Gaming", icon: Gamepad2 },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Projects by
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Technology Stack
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore open source projects across different technology domains.
            Find the perfect project that matches your tech interests.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:scale-105 shadow-md border border-gray-200 dark:border-gray-700"
                }`}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {techStacks[activeTab].map((tech, index) => (
            <div
              key={tech.name}
              className="group relative bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 flex flex-col"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Tech Icon and Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">
                    <i className={tech.icon}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tech.name}
                  </h3>
                </div>

                {/* Description (takes available space) */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed flex-1">
                  {tech.description}
                </p>

                {/* Bottom Section (Popularity + Button) */}
                <div>
                  {/* Popularity Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Popularity</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {tech.popularity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: tech.popularity }}
                      />
                    </div>
                  </div>

                  {/* Explore Button */}
                  <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-gray-700 dark:text-gray-300 hover:text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium border border-gray-200 dark:border-gray-600 hover:border-transparent">
                    Explore Projects
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg dark:shadow-gray-900/25">
            <Code className="mx-auto mb-4 text-blue-500 dark:text-blue-400" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse all technologies or suggest a new category for our growing
              collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium">
                Browse All Projects
              </button>
              <button className="border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-6 py-3 rounded-lg transition-all duration-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Suggest Technology
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;