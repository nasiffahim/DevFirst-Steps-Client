'use client'
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Menu, X, Github } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Close dropdown when clicking outside navbar
  useEffect(() => {
    const handleDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

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
    }, 220); // small delay to avoid flicker
  };

  const navItems = [
    {
      name: 'Platform',
      hasDropdown: true,
      sections: [
        {
          title: 'Discovery',
          items: [
            { name: 'Project Explorer', description: 'Browse trending open source projects', icon: '🔍' },
            { name: 'Topic Search', description: 'Find projects by technology and topic', icon: '🏷️' },
            { name: 'Advanced Filters', description: 'Filter by language, license, and more', icon: '⚙️' }
          ]
        },
        {
          title: 'Core Features',
          items: [
            { name: 'Project Analytics', description: 'Detailed insights and statistics', icon: '📊' },
            { name: 'Contribution Guide', description: 'Learn how to contribute effectively', icon: '🤝' },
            { name: 'Issue Tracker', description: 'Find beginner-friendly issues', icon: '🐛' }
          ]
        }
      ]
    },
    {
      name: 'Solutions',
      hasDropdown: true,
      sections: [
        {
          title: 'By Experience Level',
          items: [
            { name: 'Beginner Projects', description: 'Perfect for first-time contributors', icon: '🌱' },
            { name: 'Intermediate', description: 'Projects for growing developers', icon: '🚀' },
            { name: 'Expert Level', description: 'Complex projects for experts', icon: '⚡' }
          ]
        },
        {
          title: 'By Technology',
          items: [
            { name: 'JavaScript', description: 'Node.js, React, Vue projects', icon: '💛' },
            { name: 'Python', description: 'Django, Flask, ML projects', icon: '🐍' },
            { name: 'Go', description: 'Cloud-native and CLI tools', icon: '🔵' }
          ]
        },
        {
          title: 'By Use Case',
          items: [
            { name: 'Web Development', description: 'Frontend and backend projects', icon: '🌐' },
            { name: 'DevOps & Tools', description: 'Infrastructure and automation', icon: '🔧' }
          ]
        }
      ]
    },
    {
      name: 'Resources',
      hasDropdown: true,
      sections: [
        {
          title: 'Learn & Grow',
          items: [
            { name: 'Contribution Guide', description: 'Step-by-step contribution tutorials', icon: '📚' },
            { name: 'Open Source Stories', description: 'Success stories from contributors', icon: '💡' },
            { name: 'Best Practices', description: 'Code quality and project management', icon: '⭐' }
          ]
        },
        {
          title: 'Community',
          items: [
            { name: 'Developer Blog', description: 'Latest trends in open source', icon: '✍️' },
            { name: 'Newsletter', description: 'Weekly project recommendations', icon: '📧' },
            { name: 'Community Forum', description: 'Connect with other developers', icon: '💬' }
          ]
        }
      ],
      featured: [
        { title: 'Featured Project of the Week', description: 'Discover React Native Paper - Material Design components', image: '🎨' },
        { title: 'Trending: AI/ML Projects', description: 'Explore the hottest machine learning repositories', image: '🤖' }
      ]
    },
    { name: 'Pricing', hasDropdown: false },
    { name: 'About', hasDropdown: false }
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* containerRef ensures dropdowns positioned relative to this block */}
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">ProjectFinder</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block grid grid-cols-3">
            <div className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div key={item.name}>
                  <button
                    aria-haspopup={item.hasDropdown ? 'true' : undefined}
                    aria-expanded={activeDropdown === index}
                    onMouseEnter={() => item.hasDropdown && handleMouseEnter(index)}
                    onMouseLeave={() => item.hasDropdown && handleMouseLeave()}
                    onClick={() => item.hasDropdown && setActiveDropdown(activeDropdown === index ? null : index)}
                    className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 hover:bg-gray-200 rounded-md px-3 py-2 transition-colors duration-200">
              <Github className="h-4 w-4 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">69.6k</span>
            </div>

            <button className="hidden md:block text-gray-400 hover:text-gray-600 p-2">
              <Search className="h-5 w-5" />
            </button>

            <button className="hidden md:block text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium">
              Contact Sales
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              Get Started
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-gray-600 p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            DROPDOWNS (positioned relative to the container)
            They span center w-4/5 and are capped with max-w-6xl.
            They also have max-height + overflow for large content.
           ========================= */}
        {navItems.map((item, index) =>
          item.hasDropdown && activeDropdown === index ? (
            <div
              key={item.name}
              // this absolute is relative to containerRef (we set containerRef on the outer div)
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
                className={`mx-auto w-4/5 max-w-6xl bg-white border bg-red-700 border-gray-200 rounded-lg shadow-xl py-6 transform transition-all duration-300 ease-out ${
                  activeDropdown === index ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'
                }`}
                style={{ transformOrigin: 'center top' }}
              >
                <div className="flex gap-6 max-h-[60vh] overflow-auto px-4 grid grid-cols-2 w-full">
                  {/* Left side - Navigation sections */}
                  <div className={`${item.featured ? 'w-3/5 pr-6 grid grid-cols-3' : 'w-full'} py-2`}>
                    {item.sections && item.sections.map((section, sectionIndex) => (
                      <div key={section.title} className={sectionIndex > 0 ? 'mt-6' : ''}>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((dropdownItem) => (
                            <a
                              key={dropdownItem.name}
                              href="#"
                              className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors duration-150 group"
                            >
                              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md">
                                <span className="text-lg">{dropdownItem.icon}</span>
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-150">
                                  {dropdownItem.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {dropdownItem.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right side - Featured (if present) */}
                  {item.featured && (
                    <div className="w-2/5 pl-6 border-l border-gray-100 py-2">
                      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Don't miss it
                      </h3>
                      <div className="space-y-4">
                        {item.featured.map((feature, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-start">
                              <div className="text-2xl mr-3 mt-1">{feature.image}</div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed">{feature.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTA */}
                <div className="border-t border-gray-100 mt-6 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start exploring projects</p>
                      <p className="text-xs text-gray-500">Find your next contribution today</p>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center">
                      Browse now →
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
                  <button
                    onClick={() => item.hasDropdown && setActiveDropdown(activeDropdown === index ? null : index)}
                    className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {item.hasDropdown && activeDropdown === index && (
                    <div className="pl-6 space-y-3 mt-2">
                      {item.sections && item.sections.map((section) => (
                        <div key={section.title} className="space-y-2">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{section.title}</h4>
                          {section.items.map((dropdownItem) => (
                            <a key={dropdownItem.name} href="#" className="flex items-center text-gray-600 hover:text-gray-900 py-2 text-sm transition-colors duration-150">
                              <span className="mr-3 text-base">{dropdownItem.icon}</span>
                              <div>
                                <div className="font-medium">{dropdownItem.name}</div>
                                <div className="text-xs text-gray-400 mt-1">{dropdownItem.description}</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex items-center px-3 py-2">
                <Github className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">69.6k</span>
              </div>

              <div className="px-3 py-2 space-y-2">
                <button className="w-full text-left text-gray-700 hover:text-gray-900 py-2 text-sm font-medium">Contact Sales</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
