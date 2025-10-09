import React from "react";
import { Award } from "lucide-react";

const Badge = ({ badge }) => {
  const getBadgeStyles = (badgeType) => {
    switch (badgeType?.toLowerCase()) {
      case "gold":
        return {
          bg: "bg-gradient-to-r from-yellow-400 to-yellow-600",
          text: "text-yellow-900",
          icon: "text-yellow-900",
          ring: "ring-2 ring-yellow-300/50",
          shadow: "shadow-yellow-200/50 dark:shadow-yellow-900/50"
        };
      case "silver":
        return {
          bg: "bg-gradient-to-r from-gray-300 to-gray-500",
          text: "text-gray-900",
          icon: "text-gray-900",
          ring: "ring-2 ring-gray-300/50",
          shadow: "shadow-gray-200/50 dark:shadow-gray-700/50"
        };
      case "bronze":
        return {
          bg: "bg-gradient-to-r from-orange-400 to-orange-600",
          text: "text-orange-900",
          icon: "text-orange-900",
          ring: "ring-2 ring-orange-300/50",
          shadow: "shadow-orange-200/50 dark:shadow-orange-900/50"
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-600",
          text: "text-gray-700 dark:text-gray-200",
          icon: "text-gray-600 dark:text-gray-300",
          ring: "ring-2 ring-gray-300/50 dark:ring-gray-600/50",
          shadow: "shadow-gray-200/50 dark:shadow-gray-800/50"
        };
    }
  };

  const styles = getBadgeStyles(badge);
  const displayText = badge || "Newbie";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${styles.bg} ${styles.text} ${styles.ring} text-xs font-bold shadow-md ${styles.shadow} transition-all duration-200 hover:scale-105`}
    >
      <Award className={`w-3.5 h-3.5 ${styles.icon}`} />
      {displayText.toUpperCase()}
    </span>
  );
};

export default Badge;