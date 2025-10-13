import React from "react";
// import CollaborationCard from '@/Components/Collaboration/Card/CollaborationCard';
import CollaborationCard from "../../Components/Collaboration/Card/CollaborationCard";

const page = () => {
  const dummyData = [
    {
      _id: "1",
      title: "AI Task Manager",
      owner: "Shohel",
      description:
        "An AI-driven productivity tool to manage your daily tasks efficiently.",
      skills: ["React", "Node.js", "MongoDB", "Tailwind"],
      currentMembers: 3,
      teamSizeGoal: 5,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyData.map((collab) => (
          <CollaborationCard key={collab._id} collaboration={collab} />
        ))}
      </div>
    </div>
  );
};

export default page;
