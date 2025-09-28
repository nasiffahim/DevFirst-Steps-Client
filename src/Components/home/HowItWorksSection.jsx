'use client'
import React from 'react';
import { Search, Upload, MessageCircle, BookOpen, Filter, Users, Star, GitBranch } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: Search,
      title: "Discover Projects",
      description: "Search for open source projects by technology stack, programming language, or category. Filter by web, mobile, AI, networking, and more.",
      features: ["Advanced filtering", "Tech stack search", "Category browsing"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      icon: Upload,
      title: "Submit Your Project",
      description: "Share your own open source projects with the community. Login to submit, manage, and showcase your work to fellow developers.",
      features: ["Easy submission", "Project management", "Portfolio building"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      icon: MessageCircle,
      title: "Join Discussions",
      description: "Engage with the community through project discussions. Share thoughts, ask questions, and collaborate with other developers.",
      features: ["Project discussions", "Community feedback", "Collaborative insights"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 4,
      icon: BookOpen,
      title: "Share Stories",
      description: "Write blog posts about your development journey, project experiences, or any tech-related topics that inspire the community.",
      features: ["Developer blogs", "Journey sharing", "Tech insights"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    { icon: Filter, label: "Smart Filtering", description: "Filter by tech stack, language, difficulty" },
    { icon: Users, label: "Active Community", description: "Connect with developers worldwide" },
    { icon: Star, label: "Project Rating", description: "Rate and review projects" },
    { icon: GitBranch, label: "Open Source", description: "100% open source platform" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your gateway to discovering, sharing, and collaborating on open source projects. 
            Join a thriving community of developers building the future together.
          </p>
        </div>

        {/* Main Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl dark:shadow-gray-900/25 dark:hover:shadow-gray-900/40 transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.id}
                </div>
                
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-gray-100 dark:group-hover:to-gray-400 transition-all duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {step.description}
                </p>

                {/* Features list */}
                <div className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Features
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Everything you need to discover and contribute to open source projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center group cursor-pointer"
                  style={{
                    animationDelay: `${index * 150 + 600}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl mb-4 group-hover:border-gray-300 dark:group-hover:border-gray-500 group-hover:scale-110 transition-all duration-300 shadow-sm dark:shadow-gray-900/25">
                    <Icon className="w-7 h-7 text-gray-700 dark:text-gray-300" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.label}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center space-x-4">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg dark:hover:shadow-blue-500/25">
              Start Exploring
            </button>
            <button className="border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Submit Project
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;