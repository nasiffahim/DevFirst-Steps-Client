import { Code2, Database, Zap, Shield, FolderTree } from "lucide-react";

const bestPracticesData = [
  {
    language: "JavaScript / TypeScript",
    color: "text-yellow-500",
    description:
      "JavaScript and TypeScript are the backbone of web development. Follow these practices to write clean, maintainable, and performant code.",
    practices: [
      "Use const and let instead of var.",
      "Prefer async/await over callbacks.",
      "Always handle errors with try/catch.",
      "Use TypeScript for large projects to prevent type errors.",
      "Keep components and functions small and reusable.",
      "Use ESLint and Prettier for consistent formatting.",
    ],
  },
  {
    language: "Python",
    color: "text-blue-500",
    description:
      "Python is known for simplicity and readability. Keep your code clean, efficient, and easy to maintain.",
    practices: [
      "Follow PEP 8 style guidelines.",
      "Use virtual environments to manage dependencies.",
      "Handle exceptions properly using try/except blocks.",
      "Document your functions and classes using docstrings.",
      "Use type hints for clarity and static analysis.",
      "Avoid large monolithic scripts — modularize your code.",
    ],
  },
  {
    language: "C / C++",
    color: "text-green-600",
    description:
      "C and C++ offer great performance but require careful memory and pointer management. Write efficient and safe code.",
    practices: [
      "Always initialize variables before use.",
      "Free allocated memory to prevent leaks.",
      "Use const where possible to protect data.",
      "Avoid global variables unless absolutely necessary.",
      "Use smart pointers in C++ (unique_ptr, shared_ptr).",
      "Keep functions small and avoid side effects.",
    ],
  },
  {
    language: "Java",
    color: "text-red-600",
    description:
      "Java emphasizes stability and structure. Follow OOP principles and maintain clean project architecture.",
    practices: [
      "Follow consistent naming conventions (CamelCase, PascalCase).",
      "Keep classes small and focused.",
      "Use interfaces and abstract classes for scalability.",
      "Avoid hardcoding configuration values.",
      "Use try-with-resources for safe file and stream handling.",
      "Write unit tests using JUnit.",
    ],
  },
  {
    language: "PHP",
    color: "text-indigo-500",
    description:
      "PHP powers a large part of the web. Keep your PHP code secure and efficient.",
    practices: [
      "Use PDO or MySQLi for database operations with prepared statements.",
      "Validate and sanitize all user input.",
      "Avoid mixing HTML and PHP logic in the same file.",
      "Use namespaces and autoloading with Composer.",
      "Store configuration in environment variables.",
      "Use modern frameworks like Laravel for clean structure.",
    ],
  },
  {
    language: "Go (Golang)",
    color: "text-cyan-600",
    description:
      "Go is fast, simple, and ideal for concurrent applications. Write idiomatic, maintainable code.",
    practices: [
      "Follow Go’s naming and formatting conventions (gofmt).",
      "Use goroutines and channels responsibly to avoid leaks.",
      "Check all errors returned by functions.",
      "Use context for cancellation in goroutines.",
      "Keep your packages small and cohesive.",
      "Document exported functions using comments.",
    ],
  },
  {
    language: "Rust",
    color: "text-orange-600",
    description:
      "Rust focuses on safety and performance. Embrace its ownership model and best practices.",
    practices: [
      "Understand ownership, borrowing, and lifetimes deeply.",
      "Prefer immutable variables by default.",
      "Use Result and Option for error handling.",
      "Avoid unnecessary clones to improve performance.",
      "Write tests using cargo test for each module.",
      "Use cargo fmt and cargo clippy regularly.",
    ],
  },
];

export default function BestPracticesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-6 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-14">
        <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
          🌍 Universal Programming Best Practices
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Follow these best practices for multiple programming languages — write cleaner, faster, and more secure code across your tech stack.
        </p>
      </div>

      {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {bestPracticesData.map((lang, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl p-6 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <Code2 className={`w-6 h-6 ${lang.color}`} />
              <h2 className="text-2xl font-bold">{lang.language}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {lang.description}
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {lang.practices.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    
    </div>
  );
}
