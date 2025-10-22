"use client";
import React, { useState } from "react";
import { Github, Loader2 } from "lucide-react";

const AiProjectSuggestions = () => {
const [userSkills, setUserSkills] = useState("");
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSuggest = async () => {
if (!userSkills.trim()) {
setError("Please enter your skills first!");
return;
}


setError("");
setLoading(true);
setProjects([]);

try {
  const response = await fetch("http://localhost:5000/get-projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skills: userSkills }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });

    const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));
    for (const line of lines) {
      const data = JSON.parse(line.replace("data: ", ""));
      if (data.error) setError(data.error);
      else if (data.done) setLoading(false);
      else if (data.content) {
        const project = JSON.parse(data.content);
        setProjects((prev) => [...prev, project]);
      }
    }
  }
} catch (err) {
  console.error(err);
  setError("Failed to fetch AI suggestions.");
  setLoading(false);
}

};

return ( <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg dark:bg-gray-900 dark:text-white"> <h2 className="text-2xl font-semibold mb-4 text-center">
💡 AI-Based Project Idea Suggestions </h2>

```
  <textarea
    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
    placeholder="Enter your skills (e.g. React, Node.js, Python, AI)"
    rows={3}
    value={userSkills}
    onChange={(e) => setUserSkills(e.target.value)}
  />

  <button
    onClick={handleSuggest}
    disabled={loading}
    className="mt-4 w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-blue-400 flex justify-center items-center"
  >
    {loading ? (
      <>
        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Ideas...
      </>
    ) : (
      "Get AI Suggestions"
    )}
  </button>

  {error && <p className="mt-3 text-red-500 text-center">{error}</p>}

  <div className="mt-6 space-y-4">
    {projects.map((p, idx) => (
      <div
        key={idx}
        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50 dark:bg-gray-800"
      >
        <h3 className="text-lg font-semibold">{p.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{p.description}</p>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          <span>⭐ {p.stars}</span>
          <span>💻 {p.language || "Unknown"}</span>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:underline"
          >
            <Github className="w-4 h-4 mr-1" /> View Repo
          </a>
        </div>
      </div>
    ))}
  </div>
</div>

);
};

export default AiProjectSuggestions;
