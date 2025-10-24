import React from 'react';
import { Trophy, Sparkles, Rocket, Target, TrendingUp, GitCommit, Award, Zap, Star, CheckCircle2 } from 'lucide-react';

// Commit Percentage Card Component
export default function CommitPercentageCard({ commitPercentage, loadingCommits, commitError }) {
  // Don't show anything while loading or if there's an error
  if (loadingCommits) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Loading your contribution data...</p>
        </div>
      </div>
    );
  }

  if (commitError) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-gray-800 dark:text-gray-200 font-semibold">Ready to Contribute?</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Make your first commit to see your impact!</p>
          </div>
        </div>
      </div>
    );
  }

  // No contribution yet (0%)
  if (commitPercentage === 0 || commitPercentage === null) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30 border border-purple-200 dark:border-purple-800 rounded-2xl p-6 shadow-lg">
        {/* Animated background sparkles */}
        <div className="absolute top-2 right-2 animate-pulse">
          <Sparkles className="w-6 h-6 text-purple-400 dark:text-purple-300" />
        </div>
        <div className="absolute bottom-2 left-2 animate-bounce">
          <Rocket className="w-5 h-5 text-pink-400 dark:text-pink-300" />
        </div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              🚀 Ready to Make Your Mark?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              You haven't contributed yet, but every great journey starts with a single commit! 
              <span className="font-semibold text-purple-600 dark:text-purple-400"> Be the first to contribute</span> and watch your impact grow! 💪
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <GitCommit className="w-4 h-4" />
              <span>Your contribution percentage will appear here once you make your first commit</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has contribution - determine tier and messaging
  const getTier = (percentage) => {
    if (percentage >= 50) return 'legendary';
    if (percentage >= 30) return 'champion';
    if (percentage >= 15) return 'rising-star';
    if (percentage >= 5) return 'contributor';
    return 'starter';
  };

  const tier = getTier(commitPercentage);

  const tierConfig = {
    'legendary': {
      gradient: 'from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/40 dark:via-amber-950/40 dark:to-orange-950/40',
      border: 'border-yellow-300 dark:border-yellow-700',
      icon: Trophy,
      iconBg: 'from-yellow-500 to-orange-500',
      iconColor: 'text-white',
      title: '🏆 Legendary Contributor!',
      message: "You're absolutely crushing it! Your dedication is inspiring the entire team! 🌟",
      emoji: '🔥',
      ringColor: 'stroke-yellow-500',
      trailColor: 'stroke-yellow-200 dark:stroke-yellow-900',
      textColor: 'text-yellow-700 dark:text-yellow-300'
    },
    'champion': {
      gradient: 'from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40',
      border: 'border-blue-300 dark:border-blue-700',
      icon: Award,
      iconBg: 'from-blue-500 to-purple-500',
      iconColor: 'text-white',
      title: '🎯 Champion Level!',
      message: "Outstanding work! You're a key player in this project's success! 💎",
      emoji: '⚡',
      ringColor: 'stroke-blue-500',
      trailColor: 'stroke-blue-200 dark:stroke-blue-900',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    'rising-star': {
      gradient: 'from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40',
      border: 'border-green-300 dark:border-green-700',
      icon: TrendingUp,
      iconBg: 'from-green-500 to-emerald-500',
      iconColor: 'text-white',
      title: '⭐ Rising Star!',
      message: "You're making solid progress! Keep up the great momentum! 🚀",
      emoji: '🌟',
      ringColor: 'stroke-green-500',
      trailColor: 'stroke-green-200 dark:stroke-green-900',
      textColor: 'text-green-700 dark:text-green-300'
    },
    'contributor': {
      gradient: 'from-cyan-50 via-sky-50 to-blue-50 dark:from-cyan-950/40 dark:via-sky-950/40 dark:to-blue-950/40',
      border: 'border-cyan-300 dark:border-cyan-700',
      icon: Zap,
      iconBg: 'from-cyan-500 to-sky-500',
      iconColor: 'text-white',
      title: '💪 Active Contributor!',
      message: "Great start! Your contributions are making a real difference! 🎉",
      emoji: '✨',
      ringColor: 'stroke-cyan-500',
      trailColor: 'stroke-cyan-200 dark:stroke-cyan-900',
      textColor: 'text-cyan-700 dark:text-cyan-300'
    },
    'starter': {
      gradient: 'from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-fuchsia-950/40',
      border: 'border-violet-300 dark:border-violet-700',
      icon: Star,
      iconBg: 'from-violet-500 to-fuchsia-500',
      iconColor: 'text-white',
      title: '🌱 Getting Started!',
      message: "Awesome first steps! Every commit brings you closer to greatness! 🎯",
      emoji: '🎊',
      ringColor: 'stroke-violet-500',
      trailColor: 'stroke-violet-200 dark:stroke-violet-900',
      textColor: 'text-violet-700 dark:text-violet-300'
    }
  };

  const config = tierConfig[tier];
  const Icon = config.icon;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (commitPercentage / 100) * circumference;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${config.gradient} border ${config.border} rounded-2xl p-6 shadow-xl`}>
      {/* Animated decoration */}
      <div className="absolute top-2 right-2 animate-pulse">
        <Sparkles className={`w-6 h-6 ${config.textColor}`} />
      </div>
      
      <div className="flex items-start gap-6">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className={config.trailColor}
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className={`${config.ringColor} transition-all duration-1000 ease-out`}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          {/* Percentage text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${config.textColor}`}>
              {commitPercentage}%
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">commits</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <div className={`p-2.5 bg-gradient-to-br ${config.iconBg} rounded-lg shadow-lg flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-tight">
                {config.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1.5 leading-relaxed">
                {config.message}
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${config.textColor}`} />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                You're contributing!
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-2xl">{config.emoji}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
