import React from 'react';
import { Tag, X, Check } from 'lucide-react';

const TagSelector = ({ selectedTags, setSelectedTags }) => {
  const availableTags = [
    "React", "JavaScript", "Node.js", "MongoDB", "CSS",
    "HTML", "Next.js", "Express", "TypeScript", "Tailwind",
    "Redux", "GraphQL", "Python", "Django", "Flask",
    "Java", "Spring", "C++", "C#", "PHP",
    "Laravel", "Go", "Rust", "Kotlin", "Swift",
    "SQL", "NoSQL", "AWS", "Docker", "Kubernetes"
  ];

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Available Tags Section */}
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Select tags that best describe your discussion ({selectedTags.length} selected)
        </p>
        <div className="flex gap-2 flex-wrap max-h-64 overflow-y-auto p-1">
          {availableTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleToggleTag(tag)}
                className={`
                  group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isSelected 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md scale-105' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                `}
              >
                <span className="flex items-center gap-1.5">
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Selected Tags ({selectedTags.length})
            </h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:border-gray-400 dark:hover:border-gray-500 transition-all"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all duration-200"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSelectedTags([])}
            className="mt-3 text-xs text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
          >
            Clear all tags
          </button>
        </div>
      )}
    </div>
  );
};

export default TagSelector;