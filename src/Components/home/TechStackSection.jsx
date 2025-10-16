"use client";
import { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { techStacks } from "../shared/techStacks";

const TechStackSlider = () => {
  const [activeTab, setActiveTab] = useState("web");
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

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

  const currentTechStack = techStacks[activeTab];

  // Reset when tab changes
  useEffect(() => {
    setCurrentIndex(0);
    if (swiperRef.current) {
      swiperRef.current.slideTo(0);
    }
  }, [activeTab]);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        const swiper = swiperRef.current;
        if (swiper.isEnd) {
          swiper.slideTo(0);
        } else {
          swiper.slideNext();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentTechStack, activeTab]);

  // Initialize Swiper manually
  useEffect(() => {
    const swiperContainer = document.querySelector(".swiper-container");
    if (!swiperContainer) return;

    // Create Swiper instance
    const initSwiper = () => {
      const swiper = {
        container: swiperContainer,
        wrapper: swiperContainer.querySelector(".swiper-wrapper"),
        slides: Array.from(swiperContainer.querySelectorAll(".swiper-slide")),
        currentSlide: 0,
        isEnd: false,

        slideTo: function (index) {
          this.currentSlide = Math.max(
            0,
            Math.min(index, this.slides.length - 3)
          );
          this.updatePosition();
          this.updateIsEnd();
          setCurrentIndex(this.currentSlide);
        },

        slideNext: function () {
          this.slideTo(this.currentSlide + 1);
        },

        slidePrev: function () {
          this.slideTo(this.currentSlide - 1);
        },

        updatePosition: function () {
          const slideWidth = this.slides[0]?.offsetWidth || 0;
          const gap = 24; // 1.5rem = 24px
          const offset = -(this.currentSlide * (slideWidth + gap));
          this.wrapper.style.transform = `translateX(${offset}px)`;
        },

        updateIsEnd: function () {
          this.isEnd = this.currentSlide >= this.slides.length - 3;
        },
      };

      swiperRef.current = swiper;
      swiper.updateIsEnd();
    };

    initSwiper();

    // Re-initialize on window resize
    const handleResize = () => {
      if (swiperRef.current) {
        swiperRef.current.updatePosition();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentTechStack]);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const maxIndex = Math.max(0, currentTechStack.length - 3);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
      <div className="absolute inset-0 z-0">
        <img
          src="/tech-bg.jpg"
          alt="Tech Globe Background"
          className="w-full h-full object-cover opacity-25 dark:opacity-30"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 font-medium ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 shadow-md border border-gray-200 dark:border-gray-700"
                }`}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Swiper Container */}
        <div className="relative mb-8">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 ${
              currentIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white hover:scale-110"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Swiper */}
          <div className="swiper-container overflow-hidden px-12 py-5">
            <div className="swiper-wrapper flex gap-6 transition-transform duration-500 ease-out">
              {currentTechStack.map((tech, index) => (
                <div
                  key={`${tech.name}-${index}`}
                  className="swiper-slide flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="group relative bg-white dark:bg-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 flex flex-col h-full">
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

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed flex-1">
                        {tech.description}
                      </p>

                      {/* Bottom Section */}
                      <div>
                        {/* Popularity Bar */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                              Popularity
                            </span>
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
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 ${
              currentIndex >= maxIndex
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-500 hover:text-white hover:scale-110"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Slider Controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {/* Progress Dots */}
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (swiperRef.current) {
                    swiperRef.current.slideTo(index);
                  }
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-2"
                    : "bg-gray-300 dark:bg-gray-600 w-2 h-2 hover:bg-gray-400 dark:hover:bg-gray-500"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg dark:shadow-gray-900/25">
            <Code
              className="mx-auto mb-4 text-blue-500 dark:text-blue-400"
              size={48}
            />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Browse all technologies or suggest a new category for our growing
              collection
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105">
                Browse All Projects
              </button>
              <button className="border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-6 py-3 rounded-lg transition-all duration-300 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20">
                Suggest Technology
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStackSlider;
