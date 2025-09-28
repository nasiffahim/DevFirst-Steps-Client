"use client";
import { useState } from "react";
import {
  Globe,
  Smartphone,
  Apple,
  Brain,
  Network,
  Database,
  Cloud,
  Gamepad2,
  Code,
  Settings,
} from "lucide-react";

const TechStackSection = () => {
  const [activeTab, setActiveTab] = useState("web");

  const tabs = [
    { id: "web", label: "Web", icon: Globe },
    { id: "android", label: "Android", icon: Smartphone },
    { id: "ios", label: "iOS", icon: Apple },
    { id: "ai", label: "AI/ML", icon: Brain },
    { id: "networking", label: "Networking", icon: Network },
    { id: "database", label: "Database", icon: Database },
    { id: "cloud", label: "Cloud", icon: Cloud },
    { id: "gaming", label: "Gaming", icon: Gamepad2 },
  ];

  const techStacks = {
    web: [
      {
        name: "React",
        icon: "devicon-react-original colored",
        description: "A JavaScript library for building user interfaces",
        popularity: "95%",
      },
      {
        name: "Next.js",
        icon: "devicon-nextjs-plain colored",
        description: "The React Framework for Production",
        popularity: "92%",
      },
      {
        name: "Vue.js",
        icon: "devicon-vuejs-plain colored",
        description: "Progressive JavaScript Framework",
        popularity: "85%",
      },
      {
        name: "Angular",
        icon: "devicon-angularjs-plain colored",
        description:
          "Platform for building mobile and desktop web applications",
        popularity: "78%",
      },
      {
        name: "Svelte",
        icon: "devicon-svelte-plain colored",
        description: "Cybernetically enhanced web apps",
        popularity: "82%",
      },
      {
        name: "Node.js",
        icon: "devicon-nodejs-plain colored",
        description: "JavaScript runtime built on Chrome's V8 engine",
        popularity: "89%",
      },
      {
        name: "Express.js",
        icon: "devicon-express-original colored",
        description:
          "Fast, unopinionated, minimalist web framework for Node.js",
        popularity: "87%",
      },
      {
        name: "TypeScript",
        icon: "devicon-typescript-plain colored",
        description: "Typed superset of JavaScript",
        popularity: "91%",
      },
    ],
    android: [
      {
        name: "Kotlin",
        icon: "devicon-kotlin-plain colored",
        description: "Modern programming language for Android development",
        popularity: "88%",
      },
      {
        name: "Java",
        icon: "devicon-java-plain colored",
        description: "Popular programming language for Android apps",
        popularity: "85%",
      },
      {
        name: "Flutter",
        icon: "devicon-flutter-plain colored",
        description: "UI toolkit for building natively compiled applications",
        popularity: "84%",
      },
      {
        name: "React Native",
        icon: "devicon-react-original colored",
        description: "Build native mobile apps with React",
        popularity: "80%",
      },
      {
        name: "Xamarin",
        icon: "devicon-xamarin-original colored",
        description: "Cross-platform mobile app development framework",
        popularity: "70%",
      },
      {
        name: "Android Studio",
        icon: "devicon-androidstudio-plain colored",
        description: "Official IDE for Android development",
        popularity: "90%",
      },
    ],
    ios: [
      {
        name: "Swift",
        icon: "devicon-swift-plain colored",
        description: "Powerful programming language for iOS development",
        popularity: "87%",
      },
      {
        name: "SwiftUI",
        icon: "devicon-swift-plain colored",
        description:
          "Declarative framework for building UIs on Apple platforms",
        popularity: "75%",
      },
      {
        name: "UIKit",
        icon: "custom-icon",
        description:
          "Framework for constructing and managing graphical components",
        popularity: "78%",
      },
      {
        name: "Xcode",
        icon: "devicon-xcode-plain colored",
        description: "Apple’s official IDE for iOS development",
        popularity: "92%",
      },
      {
        name: "Objective-C",
        icon: "devicon-objectivec-plain colored",
        description: "Legacy programming language for iOS/macOS apps",
        popularity: "65%",
      },
      {
        name: "Core Data",
        icon: "devicon-apple-original colored",
        description: "Framework for managing object graphs and persistence",
        popularity: "70%",
      },
    ],
    ai: [
      {
        name: "TensorFlow",
        icon: "devicon-tensorflow-original colored",
        description: "End-to-end open-source platform for machine learning",
        popularity: "90%",
      },
      {
        name: "PyTorch",
        icon: "devicon-pytorch-original colored",
        description: "Deep learning framework with strong Python support",
        popularity: "88%",
      },
      {
        name: "Scikit-learn",
        icon: "devicon-scikitlearn-plain colored",
        description: "Machine learning library for Python",
        popularity: "83%",
      },
      {
        name: "Keras",
        icon: "devicon-keras-plain colored",
        description: "Deep learning API written in Python",
        popularity: "80%",
      },
      {
        name: "OpenCV",
        icon: "devicon-opencv-plain colored",
        description: "Library for computer vision and image processing",
        popularity: "82%",
      },
      {
        name: "Pandas",
        icon: "devicon-pandas-plain",
        description: "Data analysis and manipulation library",
        popularity: "89%",
      },
      {
        name: "NumPy",
        icon: "devicon-numpy-plain colored",
        description: "Fundamental package for scientific computing with Python",
        popularity: "87%",
      },
      {
        name: "Jupyter",
        icon: "devicon-jupyter-plain colored",
        description: "Interactive notebooks for data science and AI",
        popularity: "85%",
      },
    ],
    networking: [
      {
        name: "Socket.io",
        icon: "devicon-socketio-original colored",
        description: "Real-time communication library",
        popularity: "80%",
      },
      {
        name: "GraphQL",
        icon: "devicon-graphql-plain colored",
        description: "Query language for APIs",
        popularity: "82%",
      },
      {
        name: "REST API",
        icon: "custom-icon",
        description: "Standard architecture style for APIs",
        popularity: "90%",
      },
      {
        name: "gRPC",
        icon: "devicon-grpc-plain colored",
        description: "High-performance RPC framework",
        popularity: "75%",
      },
      {
        name: "WebRTC",
        icon: "WebRTC Icon",
        description: "Real-time communication protocol",
        popularity: "78%",
      },
      {
        name: "Nginx",
        icon: "devicon-nginx-original colored",
        description: "Web server and reverse proxy",
        popularity: "85%",
      },
    ],
    database: [
      {
        name: "PostgreSQL",
        icon: "devicon-postgresql-plain colored",
        description: "Advanced open source relational database",
        popularity: "88%",
      },
      {
        name: "MySQL",
        icon: "devicon-mysql-plain colored",
        description: "Popular open source relational database",
        popularity: "87%",
      },
      {
        name: "MongoDB",
        icon: "devicon-mongodb-plain colored",
        description: "NoSQL database for modern applications",
        popularity: "86%",
      },
      {
        name: "Redis",
        icon: "devicon-redis-plain colored",
        description: "In-memory key-value database",
        popularity: "82%",
      },
      {
        name: "SQLite",
        icon: "devicon-sqlite-plain colored",
        description: "Lightweight relational database",
        popularity: "80%",
      },
      {
        name: "Firebase",
        icon: "devicon-firebase-plain colored",
        description: "Backend-as-a-Service platform",
        popularity: "85%",
      },
    ],
    cloud: [
      {
        name: "AWS",
        icon: "devicon-amazonwebservices-plain-wordmark colored",
        description: "Amazon Web Services cloud platform",
        popularity: "93%",
      },
      {
        name: "Google Cloud",
        icon: "devicon-googlecloud-plain colored",
        description: "Google’s cloud computing services",
        popularity: "88%",
      },
      {
        name: "Azure",
        icon: "devicon-azure-plain colored",
        description: "Microsoft Azure cloud platform",
        popularity: "85%",
      },
      {
        name: "Docker",
        icon: "devicon-docker-plain colored",
        description: "Containerization platform",
        popularity: "91%",
      },
      {
        name: "Kubernetes",
        icon: "devicon-kubernetes-plain colored",
        description: "Container orchestration system",
        popularity: "89%",
      },
      {
        name: "Terraform",
        icon: "devicon-terraform-plain colored",
        description: "Infrastructure as Code tool",
        popularity: "80%",
      },
    ],
    gaming: [
      {
        name: "Unity",
        icon: "devicon-unity-plain",
        description: "Cross-platform game engine",
        popularity: "88%",
      },
      {
        name: "Unreal Engine",
        icon: "devicon-unrealengine-original colored",
        description: "Advanced real-time 3D engine",
        popularity: "85%",
      },
      {
        name: "Godot",
        icon: "devicon-godot-plain colored",
        description: "Open source 2D/3D game engine",
        popularity: "80%",
      },
      {
        name: "C#",
        icon: "devicon-csharp-plain colored",
        description: "Programming language for Unity and .NET",
        popularity: "86%",
      },
      {
        name: "C++",
        icon: "devicon-cplusplus-plain colored",
        description: "General-purpose programming language",
        popularity: "87%",
      },
      {
        name: "Blender",
        icon: "devicon-blender-original colored",
        description: "3D creation suite",
        popularity: "84%",
      },
    ],
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover Projects by
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Technology Stack
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore open source projects across different technology domains.
            Find the perfect project that matches your tech interests.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:scale-105 shadow-md border border-gray-200 dark:border-gray-700"
                }`}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {techStacks[activeTab].map((tech, index) => (
            <div
              key={tech.name}
              className="group relative bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 flex flex-col"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Tech Icon and Name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">
                    <i className={tech.icon}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tech.name}
                  </h3>
                </div>

                {/* Description (takes available space) */}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed flex-1">
                  {tech.description}
                </p>

                {/* Bottom Section (Popularity + Button) */}
                <div>
                  {/* Popularity Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Popularity</span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {tech.popularity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: tech.popularity }}
                      />
                    </div>
                  </div>

                  {/* Explore Button */}
                  <button className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 text-gray-700 dark:text-gray-300 hover:text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium border border-gray-200 dark:border-gray-600 hover:border-transparent">
                    Explore Projects
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg dark:shadow-gray-900/25">
            <Code className="mx-auto mb-4 text-blue-500 dark:text-blue-400" size={48} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse all technologies or suggest a new category for our growing
              collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium">
                Browse All Projects
              </button>
              <button className="border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-6 py-3 rounded-lg transition-all duration-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Suggest Technology
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
