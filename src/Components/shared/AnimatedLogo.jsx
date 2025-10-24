import React from 'react';
import { Terminal, Laptop, Braces, Code2 } from 'lucide-react';

export default function AnimatedLogo() {
  return (
    <div className="flex items-center">
      <div className="relative overflow-hidden h-8 flex items-center min-w-[180px]">
        {/* Text - First appearance */}
        <span className="absolute inset-0 flex items-center gap-2 animate-slide-text-1">
          <h3 className="text-lg text-gray-900 dark:text-white whitespace-nowrap" style={{ fontFamily: '"BBH Sans Hegarty", sans-serif' }}>
            DevFirst Steps
          </h3>
        </span>
        
        {/* Icons - First appearance */}
        <span className="absolute inset-0 animate-slide-icons-1 opacity-0">
          <Code2 className="absolute w-8 h-8 text-blue-500" style={{ left: '5px', top: '4px', transform: 'rotate(-8deg) scale(1.2)', opacity: 0.95 }} />
          <Terminal className="absolute w-5 h-5 text-purple-400" style={{ left: '48px', top: '12px', transform: 'rotate(5deg) scale(0.85)', opacity: 0.7 }} />
          <Laptop className="absolute w-7 h-7 text-indigo-500" style={{ left: '75px', top: '6px', transform: 'rotate(-4deg) scale(1.05)', opacity: 0.85 }} />
          <Braces className="absolute w-5 h-5 text-violet-400" style={{ left: '115px', top: '14px', transform: 'rotate(7deg) scale(0.7)', opacity: 0.65 }} />
        </span>

        {/* Text - Second appearance */}
        <span className="absolute inset-0 flex items-center gap-2 animate-slide-text-2 opacity-0">
          <h3 className="text-xl text-gray-900 dark:text-white whitespace-nowrap" style={{ fontFamily: '"BBH Sans Hegarty", sans-serif' }}>
            DevFirst Steps
          </h3>
        </span>

        {/* Icons - Second appearance */}
        <span className="absolute inset-0 animate-slide-icons-2 opacity-0">
          <Code2 className="absolute w-8 h-8 text-blue-500" style={{ left: '5px', top: '4px', transform: 'rotate(-8deg) scale(1.2)', opacity: 0.95 }} />
          <Terminal className="absolute w-5 h-5 text-purple-400" style={{ left: '48px', top: '12px', transform: 'rotate(5deg) scale(0.85)', opacity: 0.7 }} />
          <Laptop className="absolute w-7 h-7 text-indigo-500" style={{ left: '75px', top: '6px', transform: 'rotate(-4deg) scale(1.05)', opacity: 0.85 }} />
          <Braces className="absolute w-5 h-5 text-violet-400" style={{ left: '115px', top: '14px', transform: 'rotate(7deg) scale(0.7)', opacity: 0.65 }} />
        </span>
      </div>

      <style jsx>{`
        @keyframes slide-text-1 {
          0%, 22% {
            transform: translateY(0);
            opacity: 1;
          }
          25%, 100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes slide-icons-1 {
          0%, 22% {
            transform: translateY(100%);
            opacity: 0;
          }
          25%, 47% {
            transform: translateY(0);
            opacity: 1;
          }
          50%, 100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes slide-text-2 {
          0%, 47% {
            transform: translateY(100%);
            opacity: 0;
          }
          50%, 72% {
            transform: translateY(0);
            opacity: 1;
          }
          75%, 100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes slide-icons-2 {
          0%, 72% {
            transform: translateY(100%);
            opacity: 0;
          }
          75%, 97% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .animate-slide-text-1 {
          animation: slide-text-1 8s ease-in-out infinite;
        }

        .animate-slide-icons-1 {
          animation: slide-icons-1 8s ease-in-out infinite;
        }

        .animate-slide-text-2 {
          animation: slide-text-2 8s ease-in-out infinite;
        }

        .animate-slide-icons-2 {
          animation: slide-icons-2 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}