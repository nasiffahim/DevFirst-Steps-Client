'use client';
import React, { useState } from "react";
import { Github, Loader2, X, Sparkles, GitFork, Eye, ExternalLink, TrendingUp, Calendar, Users } from "lucide-react";

const availableTags = [
  "JavaScript", "Python", "React", "Node.js", "Machine Learning",
  "Django", "Flask", "Tailwind", "MongoDB", "Next.js", "TypeScript",
  "Vue.js", "Go", "Rust", "Docker", "Kubernetes"
];

const TagSelector = ({ selectedTags, setSelectedTags }) => {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        Select Your Skills
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
              selectedTags.includes(tag)
                ? "bg-blue-600 border-blue-500 text-white shadow-md"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Selected:</span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm"
            >
              {tag}
              <X
                className="w-3 h-3 cursor-pointer hover:text-blue-600"
                onClick={() => toggleTag(tag)}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AiProjectSuggestions = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [skillLevel, setSkillLevel] = useState("intermediate");
  const [interests, setInterests] = useState("");
  const [projectCount, setProjectCount] = useState(5);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamStatus, setStreamStatus] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);

  const handleSuggest = async () => {
    if (selectedTags.length === 0) {
      setError("Please select at least one skill!");
      return;
    }

    setError("");
    setLoading(true);
    setProjects([]);
    setStreamStatus("Generating project ideas...");

    try {
      const response = await fetch("http://localhost:5000/get-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          techStack: selectedTags.join(", "),
          skillLevel: skillLevel,
          interests: interests || "general development",
          count: projectCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.error) {
                setError(data.error);
                setLoading(false);
              } else if (data.status) {
                setStreamStatus(data.status);
              } else if (data.content) {
                setProjects((prev) => [...prev, data.content]);
              } else if (data.done) {
                setLoading(false);
                setStreamStatus("");
              }
            } catch (parseErr) {
              console.error("Parse error:", parseErr);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch AI suggestions. Make sure your backend is running.");
      setLoading(false);
      setStreamStatus("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl dark:bg-gray-900 dark:text-white">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-600" />
          AI Project Finder
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized open-source project recommendations based on your skills
        </p>
      </div>

      <div className="space-y-6">
        <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} />

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Skill Level
          </label>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Number of Projects
          </label>
          <select
            value={projectCount}
            onChange={(e) => setProjectCount(parseInt(e.target.value))}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="3">3 Projects</option>
            <option value="5">5 Projects</option>
            <option value="7">7 Projects</option>
            <option value="10">10 Projects</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Interests (Optional)
          </label>
          <textarea
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            placeholder="e.g., web development, data visualization, game development..."
            rows={2}
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>

        <button
          onClick={handleSuggest}
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {streamStatus || "Generating Ideas..."}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get AI Suggestions
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Recommended Projects ({projects.length})
            </h3>
            <div className="space-y-4">
              {projects.map((p, idx) => (
                <div
                  key={idx}
                  className="group p-5 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 bg-gray-50 dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {p.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {p.watchers?.toLocaleString() || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-4 h-4" />
                          {p.forks?.toLocaleString() || 0}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold">
                          ⭐ {p.stars?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                      className="ml-4 px-3 py-1 text-xs font-medium rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      {expandedCard === idx ? 'Show Less' : 'More Info'}
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                    {p.description}
                  </p>

                  {expandedCard === idx && (
                    <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3 animate-fadeIn">
                      {p.topics && p.topics.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">Topics</h5>
                          <div className="flex flex-wrap gap-1">
                            {p.topics.map((topic, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {p.openIssues !== undefined && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>{p.openIssues}</strong> open issues
                          </span>
                        </div>
                      )}

                      {p.lastUpdated && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Last updated: <strong>{new Date(p.lastUpdated).toLocaleDateString()}</strong>
                          </span>
                        </div>
                      )}

                      {p.contributorsCount && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>{p.contributorsCount}</strong> contributors
                          </span>
                        </div>
                      )}

                      {p.license && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          📄 License: <strong>{p.license}</strong>
                        </div>
                      )}
                    </div>
                  )}

                  {p.techStack && p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {p.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      💻 {p.language || "Multiple"}
                    </span>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-semibold group-hover:gap-2 transition-all"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiProjectSuggestions;