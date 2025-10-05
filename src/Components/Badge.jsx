
import React from "react";

const Badge = ({ badge }) => {
  let color = "bg-gray-300";
  if (badge === "Bronze") color = "bg-orange-400";
  if (badge === "Silver") color = "bg-gray-400";
  if (badge === "Gold") color = "bg-yellow-400";

  return (
    <span
      className={`px-2 py-1 rounded ${color} text-white text-xs font-semibold`}
    >
      {badge || "Newbie"}
    </span>
  );
};

export default Badge;
