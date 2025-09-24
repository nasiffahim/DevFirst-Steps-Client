import React from "react";
import layout from "./layout";

const page = () => {
  const stats = [
    { label: "My Blog", value: 12 },
    { label: "My Project", value: 88 },
    { label: "Bookmark Project", value: 7 },
    { label: "Project Match", value: 5 },
  ];

  // Sample placeholders
  const blogs = [1, 2, 3];
  const projects = [1, 2];
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm"
          >
            <span className="text-2xl font-bold text-gray-800">
              {item.value}
            </span>
            <span className="text-sm text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Latest Blog */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Latest Blog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {blogs.map((b) => (
            <div
              key={b}
              className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500"
            >
              Blog {b}
            </div>
          ))}
        </div>
      </section>

      {/* Latest Projects */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Latest Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p}
              className="bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-500"
            >
              Project {p}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default page;
