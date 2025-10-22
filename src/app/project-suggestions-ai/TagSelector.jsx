import React from "react";

const availableTags = [
  "JavaScript", "Python", "React", "Node.js", "Machine Learning",
  "Django", "Flask", "Tailwind", "MongoDB", "Next.js"
];

export default function TagSelector({ selectedTags, setSelectedTags }) {
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3 text-gray-200">Select Your Skills</h2>
      <div className="flex flex-wrap gap-3">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
              selectedTags.includes(tag)
                ? "bg-purple-600 border-purple-500 text-white"
                : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
