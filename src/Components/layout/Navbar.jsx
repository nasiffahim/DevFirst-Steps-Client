"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Menu, X, Code, } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  if (isDashboard) return null; 

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220);
  };

  const navItems = [
    {
      name: "Platform",
      hasDropdown: true,
      items: [
        { name: "Project Explorer", description: "Browse trending open source projects with advanced filtering and sorting capabilities.", icon: "🔍" },
        { name: "AI Code Review", description: "Get AI-powered feedback on your code contributions and pull requests.", icon: "🤖" },
        { name: "Issue Tracker", description: "Find beginner-friendly issues across thousands of repositories.", icon: "🐛" },
        { name: "Analytics Dashboard", description: "Track your contributions and project insights with detailed analytics.", icon: "📊" },
        { name: "Skill Matcher", description: "Discover projects that match your programming skills and interests.", icon: "⚡" },
        { name: "Community Hub", description: "Connect with maintainers and contributors in project communities.", icon: "👥" },
      ],
    },
    {
      name: "Solutions",
      hasDropdown: true,
      items: [
        { name: "For Beginners", description: "Curated projects perfect for first-time open source contributors.", icon: "🌱" },
        { name: "JavaScript Hub", description: "Discover React, Node.js, Vue, and other JavaScript projects.", icon: "💛" },
        { name: "Python Projects", description: "Explore Django, Flask, ML, and data science repositories.", icon: "🐍" },
        { name: "DevOps Tools", description: "Infrastructure, CI/CD, and automation project opportunities.", icon: "🔧" },
        { name: "Mobile Development", description: "React Native, Flutter, and native mobile app projects.", icon: "📱" },
        { name: "AI & Machine Learning", description: "Cutting-edge ML, AI, and data science project contributions.", icon: "🧠" },
      ],
    },
    {
      name: "Resources",
      hasDropdown: true,
      items: [
        { name: "Contribution Guide", description: "Step-by-step tutorials for making your first open source contribution.", icon: "📚" },
        { name: "Best Practices", description: "Learn code quality standards and project management techniques.", icon: "⭐" },
        { name: "Developer Blog", description: "Latest trends, tips, and success stories in open source development.", icon: "✍️" },
        { name: "API Documentation", description: "Complete API reference for integrating with our platform.", icon: "📋" },
        { name: "Community Forum", description: "Connect, ask questions, and share knowledge with other developers.", icon: "💬" },
        { name: "Newsletter", description: "Weekly curated project recommendations and industry insights.", icon: "📧" },
      ],
    },
    // ✅ New top-level items
    { name: "All Projects", hasDropdown: false, href: "/projects" },
    { name: "Dashboard", hasDropdown: false, href: "/dashboard" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 relative"
      >
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">DevFirst Steps</h3>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <button
                      aria-haspopup="true"
                      aria-expanded={activeDropdown === index}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() =>
                        setActiveDropdown(activeDropdown === index ? null : index)
                      }
                      className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.name}
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 transition-colors duration-200">
              {/* <Github className="h-4 w-4 text-gray-600 mr-2" /> */}
             
              {session ? (
          <>
            <span className="text-gray-700">Hi, {session.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}
              {/* <span className="text-sm font-medium text-gray-700">69.6k</span> */}
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <Search className="h-5 w-5" />
              </button>
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 transition-all duration-200"
                  autoFocus
                />
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-gray-600 p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dropdown Menus */}
        {navItems.map((item, index) =>
          item.hasDropdown && activeDropdown === index ? (
            <div
              key={item.name}
              className="absolute left-0 right-0 top-full mt-2 z-50"
              onMouseEnter={() => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                  timeoutRef.current = null;
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`mx-auto w-full max-w-6xl bg-white border border-gray-300 rounded-lg shadow-2xl py-8 transform transition-all duration-300 ease-out ${
                  activeDropdown === index
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 -translate-y-2 scale-95"
                }`}
                style={{ transformOrigin: "center top" }}
              >
                <div className="px-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-auto">
                  {item.items.map((dropdownItem) => (
                    <Link
                      key={dropdownItem.name}
                      href="#"
                      className="group p-4 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-transparent"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-200 rounded-lg transition-colors duration-200 mr-4 hover:text-black">
                          <span className="text-2xl">{dropdownItem.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-black group-hover:text-blue-400 transition-colors duration-200 mb-2 text-gray-950">
                            {dropdownItem.name}
                          </h3>
                          <p className="text-sm text-gray-500 group-hover:text-gray-950 transition-colors duration-200 leading-relaxed">
                            {dropdownItem.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-800 mt-8 pt-6 px-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium text-black mb-1">
                        Ready to start contributing?
                      </p>
                      <p className="text-sm text-gray-400">
                        Join thousands of developers building the future of open
                        source
                      </p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                      Explore Projects →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2 px-3">
              {navItems.map((item, index) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === index ? null : index
                          )
                        }
                        className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {activeDropdown === index && (
                        <div className="pl-6 space-y-3 mt-2">
                          {item.items.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href="#"
                              className="flex items-start text-gray-600 hover:text-gray-900 py-3 text-sm transition-colors duration-150"
                            >
                              <span className="mr-3 text-lg mt-1">
                                {dropdownItem.icon}
                              </span>
                              <div>
                                <div className="font-medium mb-1">
                                  {dropdownItem.name}
                                </div>
                                <div className="text-xs text-gray-400 leading-relaxed">
                                  {dropdownItem.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
