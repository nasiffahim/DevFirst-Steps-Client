"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { MessageSquare, Users, TrendingUp, CheckCircle } from "lucide-react";

export const CommunityStats = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/stats");
        setStats(Array.isArray(data.stats) ? data.stats : []);
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

  if (loading) return  <div className="inline-flex p-3 rounded-xl mb-4 bg-gray-200 animate-pulse">
    Loading...
  </div>;
console.log(stats);
const bgColorMap = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  // add other allowed values
};
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6 lg:p-12 p-4">
      {stats.map((stat, index) => {
        const Icon = { MessageSquare, Users, TrendingUp, CheckCircle }[stat.icon];
        return (
          <div
            key={index}
            className="rounded-2xl p-6 shadow-sm bg-gray-900 hover:bg-gray-800 transition-all duration-300"
          >
<div className="inline-flex p-3 rounded-xl mb-4" style={{ backgroundColor: stat.color|| bgColorMap}}>
              {Icon && <Icon className="w-12 h-12" />}
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};
