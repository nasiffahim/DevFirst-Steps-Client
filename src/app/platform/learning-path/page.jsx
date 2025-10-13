"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../../../Components/ui/card";
import { Check } from "lucide-react";
import api from "../../../utils/api";

export default function LearningPath() {
  const [selectedTech, setSelectedTech] = useState("PHP");
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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!data) return <p className="text-center mt-10">No data found</p>;

  const roadmapData = data[selectedTech]?.roadmap || [];
  const websitesData = data[selectedTech]?.websites || [];
  const videosData = data[selectedTech]?.videos || [];

  return (
  <div className="flex justify-center items-start min-h-screen text-black dark:text-white py-10 px-6 lg:px-20 bg-white dark:bg-gray-900">
  <Card className="w-full max-w-6xl rounded-3xl shadow-2xl border-0 overflow-hidden bg-white dark:bg-gray-800">
    {/* Header */}
    <div className="bg-gray-800 dark:bg-gray-900 p-8 lg:p-12 text-white">
      <h1 className="text-4xl lg:text-5xl font-bold mb-3 lg:mb-4">📚 Learning Path</h1>
      <p className="text-base lg:text-lg opacity-90">Explore roadmap, websites & videos</p>
    </div>

    <CardContent className="p-6 lg:p-10 space-y-8">
      {/* Tech Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <p className="text-gray-700 dark:text-gray-300 text-base lg:text-lg font-medium mb-2 sm:mb-0">
          🔽 Select Tech Stack
        </p>
        <select
          className="w-full sm:w-60 lg:w-72 border rounded-lg px-4 py-3 text-lg lg:text-xl bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
          value={selectedTech}
          onChange={(e) => setSelectedTech(e.target.value)}
        >
          {Object.keys(data).map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300 dark:border-gray-600">
        {["roadmap", "websites", "videos"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 "
                : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6 space-y-6">
        {/* Roadmap */}
        {activeTab === "roadmap" &&
          roadmapData.map((step) => {
            const isExpanded = expandedStep === step.id;
            return (
              <div
                key={step.id}
                className="p-4 rounded-lg hover:shadow-md transition bg-white dark:bg-gray-700"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3">
                    <Check className="h-6 w-6 text-black dark:text-white" />
                    <p className="font-medium text-black dark:text-white">{step.step}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2 ml-8 space-y-2 text-gray-700 dark:text-gray-300">
                    <p>{step.description}</p>

                    {step.tools && (
                      <p>
                        <span className="font-semibold">Tools: </span>
                        {step.tools.join(", ")}
                      </p>
                    )}

                    {step.resources &&
                      step.resources.map((res) => (
                        <a
                          key={res.name}
                          href={res.url}
                          target="_blank"
                          className=" hover:underline block"
                        >
                          {res.name}
                        </a>
                      ))}

                    {step.videos &&
                      step.videos.map((video) => (
                        <a
                          key={video.title}
                          href={video.url}
                          target="_blank"
                          className="hover:underline block "
                        >
                          {video.title}
                        </a>
                      ))}
                  </div>
                )}
              </div>
            );
          })}

        {/* Websites */}
        {activeTab === "websites" &&
          websitesData.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              className="block p-4 rounded-lg hover:shadow-md hover:underline bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {site.name}
            </a>
          ))}

        {/* Videos */}
        {activeTab === "videos" &&
          videosData.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              className="block p-4 rounded-lg hover:shadow-md hover:underline bg-white dark:bg-gray-700 text-black dark:text-white"
            >
              {video.title}
            </a>
          ))}
      </div>
    </CardContent>
  </Card>
</div>

  );
}
