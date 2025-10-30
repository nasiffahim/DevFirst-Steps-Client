"use client";

import { useState, useEffect } from "react";
import { 
  Check, 
  BookOpen, 
  Video, 
  ExternalLink, 
  Code, 
  GraduationCap,
  Sparkles,
  Clock,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Globe,
  PlayCircle,
  FileText,
  Wrench
} from "lucide-react";
import api from "../../../utils/api";

export default function LearningPath() {
  const [selectedTech, setSelectedTech] = useState("Python");
  const [activeTab, setActiveTab] = useState("roadmap");
  const [expandedStep, setExpandedStep] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLearningPath() {
      try {
        const res = await api.get("/learning/path");
        const formattedData = res.data.reduce((acc, tech) => {
          acc[tech.language] = {
            ...tech,
            roadmap: tech.learning_path.map((step, idx) => ({ id: idx + 1, ...step })),
            websites: tech.learning_platforms.map((p, idx) => ({ id: idx + 1, ...p })),
            videos: tech.learning_path.flatMap((step, idx) =>
              (step.videos || []).map((v, vidIdx) => ({ id: `${idx}-${vidIdx}`, ...v }))
            )
          };
          return acc;
        }, {});
        setData(formattedData);
      } catch (error) {
        console.error("Error fetching learning path:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLearningPath();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4 mx-auto"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (!data) return <p className="text-center mt-10 text-gray-600 dark:text-gray-400">No data found</p>;

  const currentStack = data[selectedTech];
  const roadmapData = currentStack?.roadmap || [];
  const websitesData = currentStack?.websites || [];
  const videosData = currentStack?.videos || [];

  const getTabIcon = (tab) => {
    switch(tab) {
      case 'roadmap': return <BookOpen className="h-5 w-5" />;
      case 'websites': return <Globe className="h-5 w-5" />;
      case 'videos': return <PlayCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>Your Journey Starts Here</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent mb-4">
            Learning Path
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master your chosen technology with our structured roadmap, curated resources, and expert guidance
          </p>
        </div>

        {/* Tech Stack Selector Card */}
        <div className="mb-8 overflow-hidden rounded-2xl border-0 shadow-xl bg-white dark:bg-gray-800">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:to-purple-400 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">Choose Your Tech Stack</h2>
                  <p className="text-purple-100 text-sm">Select a technology to explore</p>
                </div>
              </div>
              <select
                className="px-6 py-3 rounded-xl text-lg font-semibold bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-white/30 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-600 cursor-pointer shadow-lg transition-all hover:shadow-xl"
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
              >
                {Object.keys(data).map((tech) => (
                  <option key={tech} value={tech}>{tech}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Overview Stats */}
          {currentStack?.overview && (
            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">{currentStack.stack_name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{currentStack.overview.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{currentStack.overview.difficulty_level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Time to Learn</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{currentStack.overview.estimated_time_to_learn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Steps</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{roadmapData.length} Modules</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 overflow-x-auto">
          <div className="inline-flex gap-2 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg min-w-full sm:min-w-0">
            {["roadmap", "websites", "videos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {getTabIcon(tab)}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {/* Roadmap Tab */}
          {activeTab === "roadmap" && (
            <div className="space-y-4">
              {roadmapData.map((step, index) => {
                const isExpanded = expandedStep === step.id;
                return (
                  <div 
                    key={step.id} 
                    className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800"
                  >
                    <div
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      className="cursor-pointer p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                            isExpanded 
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white' 
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                                {step.step}
                                {isExpanded && <Check className="h-5 w-5 text-green-500" />}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                            </div>
                            <button className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                              {isExpanded ? (
                                <ChevronDown className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                              ) : (
                                <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                        {/* Tools */}
                        {step.tools && step.tools.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Wrench className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              <h4 className="font-bold text-gray-800 dark:text-white">Tools & Technologies</h4>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {step.tools.map((tool) => (
                                <span 
                                  key={tool} 
                                  className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Resources */}
                        {step.resources && step.resources.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              <h4 className="font-bold text-gray-800 dark:text-white">Learning Resources</h4>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {step.resources.map((res) => (
                                <a
                                  key={res.name}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                                >
                                  <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                                  <span className="text-blue-700 dark:text-blue-300 font-medium">{res.name}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Videos */}
                        {step.videos && step.videos.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <Video className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                              <h4 className="font-bold text-gray-800 dark:text-white">Video Tutorials</h4>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              {step.videos.map((video) => (
                                <a
                                  key={video.title}
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30 rounded-lg transition-colors group"
                                >
                                  <PlayCircle className="h-5 w-5 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                                  <span className="text-pink-700 dark:text-pink-300 font-medium">{video.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Websites Tab */}
          {activeTab === "websites" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {websitesData.map((site) => (
                <a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl group-hover:scale-110 transition-transform">
                      <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {site.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        Visit site
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {videosData.map((video) => (
                <a
                  key={video.id}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl group-hover:scale-110 transition-transform">
                      <PlayCircle className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors mb-1">
                        {video.title}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        Watch video
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}