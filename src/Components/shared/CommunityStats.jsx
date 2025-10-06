"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Users, TrendingUp, CheckCircle } from "lucide-react";

export const CommunityStats = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define presentation config in frontend where it belongs
  const statsConfig = [
    { 
      key: "discussions", 
      icon: MessageSquare, 
      label: "Active Discussions", 
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    { 
      key: "members", 
      icon: Users, 
      label: "Community Members", 
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    { 
      key: "replies", 
      icon: TrendingUp, 
      label: "Total Replies", 
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    { 
      key: "solved", 
      icon: CheckCircle, 
      label: "Solved Discussions", 
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch raw data from API
        const response = await fetch("http://localhost:5000/api/stats");
        const data = await response.json();
        setApiData(data.stats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statsConfig.map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700 animate-pulse"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const value = apiData?.[stat.key] || 0;
        
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-white/20 dark:border-gray-700"
          >
            <div
              className={`inline-flex p-3 rounded-xl mb-4 ${stat.bgColor}`}
            >
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};