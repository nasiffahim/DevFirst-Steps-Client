"use client"
import { useEffect, useState } from "react";

export default function ProjectList({ limit }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/projects.json") // fetch from public folder
      .then((res) => res.json())
      .then((data) => {
        if (limit) {
          // take last N projects if limit is provided
          setProjects(data.slice(-limit).reverse());
        } else {
          setProjects(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [limit]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-[60vh] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading amazing projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-[60vh] py-16">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {limit ? `Featured Projects` : `All Projects`}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover open source projects that match your skill level and interests. 
            Each project is carefully selected to help you grow as a developer.
          </p>
          {limit && (
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Showing {projects.length} featured projects
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack Tags (if available) */}
                {project.techStack && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                        +{project.techStack.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button className="group/btn flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Details
                  </button>

                  <button className="group/btn flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live
                  </button>

                  <button className="group/btn flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {projects.length === 0 && !loading && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Check back later for new projects!</p>
          </div>
        )}

        {/* Load More Button (if limited) */}
        {limit && projects.length >= limit && (
          <div className="text-center mt-12">
            <button className="group inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <span>View All Projects</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
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

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}