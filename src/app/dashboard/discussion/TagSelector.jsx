
// TagSelector Component
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
    <div>
      <h2 className="font-bold text-lg mb-2">Tags:</h2>
      <div className="flex gap-2 flex-wrap">
        {availableTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleToggleTag(tag)}
            className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
              selectedTags.includes(tag)
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* {selectedTags.length > 0 && (
        <>
          <h2 className="font-bold text-lg mt-4 mb-2">Selected Tags:</h2>
          <div className="flex gap-2 flex-wrap">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full flex items-center gap-2 border border-blue-300 bg-blue-100 text-blue-700 font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="ml-1 text-sm bg-blue-200 rounded-full px-2 hover:bg-blue-300 transition"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </>
      )} */}
    </div>
  );
};

export default TagSelector;
