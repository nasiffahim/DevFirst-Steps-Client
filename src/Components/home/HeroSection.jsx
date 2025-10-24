'use client'
import React, { useState, useEffect } from "react";
import Link from "next/link";

const HeroSection = () => {
  // Tech stack icons using Devicon classes
  const techIcons = [
    { name: 'React', icon: 'devicon-react-original', color: '#61DAFB' },
    { name: 'Node.js', icon: 'devicon-nodejs-plain', color: '#339933' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain', color: '#3178C6' },
    { name: 'JavaScript', icon: 'devicon-javascript-plain', color: '#F7DF1E' },
    { name: 'Python', icon: 'devicon-python-plain', color: '#3776AB' },
    { name: 'Git', icon: 'devicon-git-plain', color: '#F05032' },
    { name: 'Docker', icon: 'devicon-docker-plain', color: '#2496ED' },
    { name: 'MongoDB', icon: 'devicon-mongodb-plain', color: '#47A248' },
    { name: 'PostgreSQL', icon: 'devicon-postgresql-plain', color: '#4169E1' },
    { name: 'Next.js', icon: 'devicon-nextjs-plain', color: '#000000' },
    { name: 'Tailwind', icon: 'devicon-tailwindcss-plain', color: '#06B6D4' },
    { name: 'Redux', icon: 'devicon-redux-original', color: '#764ABC' },
    { name: 'Express', icon: 'devicon-express-original', color: '#000000' },
    { name: 'Vue', icon: 'devicon-vuejs-plain', color: '#4FC08D' },
    { name: 'Angular', icon: 'devicon-angularjs-plain', color: '#DD0031' },
    { name: 'Firebase', icon: 'devicon-firebase-plain', color: '#FFCA28' },
    { name: 'GraphQL', icon: 'devicon-graphql-plain', color: '#E10098' },
    { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark', color: '#FF9900' },
    { name: 'Linux', icon: 'devicon-linux-plain', color: '#FCC624' },
    { name: 'VS Code', icon: 'devicon-vscode-plain', color: '#007ACC' },
  ];

  const [floatingIcons, setFloatingIcons] = useState([]);

  // Generate only on the client to avoid SSR mismatch
  useEffect(() => {
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const icons = Array(40).fill(null).map((_, i) => {
      const layer = i % 3;
      return {
        icon: techIcons[i % techIcons.length],
        left: `${seededRandom(i * 12.9898 + 78.233) * 100}%`,
        size: layer === 0 ? 'text-4xl' : layer === 1 ? 'text-3xl' : 'text-2xl',
        opacity: layer === 0 ? 0.7 : layer === 1 ? 0.5 : 0.35,
        delay: seededRandom(i * 43.758 + 21.334) * 20,
        duration: layer === 0 ? 20 : layer === 1 ? 25 : 30,
      };
    });

    setFloatingIcons(icons);
  }, []);

  // More large animated icons - 12 total
  const animatedIcons = [
    { icon: techIcons[0], animation: 'float-lr', delay: 0, top: 15, left: 8 },
    { icon: techIcons[1], animation: 'float-ud', delay: 0.5, top: 25, left: 88 },
    { icon: techIcons[2], animation: 'scale-pulse', delay: 1, top: 45, left: 5 },
    { icon: techIcons[3], animation: 'float-diagonal', delay: 1.5, top: 14, left: 70 },
    { icon: techIcons[4], animation: 'float-lr-reverse', delay: 2, top: 35, left: 25 },
    { icon: techIcons[5], animation: 'scale-pulse', delay: 2.5, top: 55, left: 85 },
    { icon: techIcons[6], animation: 'float-ud', delay: 3, top: 75, left: 15 },
    { icon: techIcons[7], animation: 'float-lr', delay: 0.8, top: 20, left: 50 },
    { icon: techIcons[8], animation: 'float-diagonal', delay: 1.2, top: 70, left: 65 },
    { icon: techIcons[9], animation: 'float-lr-reverse', delay: 1.8, top: 40, left: 45 },
    { icon: techIcons[10], animation: 'scale-pulse', delay: 2.2, top: 60, left: 50 },
    { icon: techIcons[11], animation: 'float-ud', delay: 2.8, top: 80, left: 80 },
  ];

  return (
  <div
    className="bg-white dark:bg-gray-900 min-h-[90vh] pt-20 pb-16 relative overflow-hidden transition-colors duration-300 hero-banner"
  >
    {/* Load Devicon CSS */}
    <link
      rel="stylesheet"
      type="text/css"
      href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
    />

    {/* Background image layer */}
    <div className="absolute inset-0 z-0">
      <img
        src="/world.jpeg"
        alt="Tech Globe Background"
        className="w-full h-full object-cover opacity-25 dark:opacity-30"
      />
    </div>

    {/* Small floating icons */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {floatingIcons.map((item, i) => (
        <div
          key={`float-${i}`}
          className="absolute hero-float-vertical"
          style={{
            left: item.left,
            bottom: "-60px",
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
          }}
        >
          <i
            className={`${item.icon.icon} ${item.size}`}
            style={{
              color: item.icon.color,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
              opacity: item.opacity,
            }}
          ></i>
        </div>
      ))}
    </div>

    {/* Large animated icons */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {animatedIcons.map((item, i) => (
        <div
          key={`anim-${i}`}
          className={`absolute hero-icon-${item.animation}-start`}
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
          }}
        >
          <i
            className={`${item.icon.icon} text-5xl`}
            style={{
              color: item.icon.color,
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.15))",
              opacity: 0.4,
            }}
          ></i>
        </div>
      ))}
    </div>

    {/* Content */}
    <div className="max-w-6xl mx-auto px-6 text-center relative z-20">
      
      {/* Main heading */}
      <h1 className="text-5xl md:text-7xl mt-12 pb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent hero-fade-in-up " style={{ fontFamily: '"BBH Sans Hegarty", sans-serif' }}>
        DevFirst Steps
      </h1>

      {/* Subheading */}
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 hero-fade-in-up hero-delay-200">
        Your Gateway to Open Source Excellence
      </h2>

      {/* Description */}
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed hero-fade-in-up hero-delay-300">
        Discover carefully curated open source projects perfect for developers at every level. 
        From beginner-friendly repositories to advanced frameworks, find your next contribution 
        and accelerate your coding journey.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center hero-fade-in-up hero-delay-500">
        <Link href="/projects">
          <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg dark:hover:shadow-blue-500/25 flex items-center space-x-2">
            <span>Explore Projects</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </Link>

        <Link href="https://github.com/topics/open-source-project">
          <button className="group bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-md dark:hover:shadow-gray-700/25 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>View on GitHub</span>
          </button>
        </Link>
      </div>
    </div>
  </div>
);

};

export default HeroSection;