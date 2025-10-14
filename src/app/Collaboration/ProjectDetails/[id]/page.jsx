import React from 'react';
import ProjectDetails from './ProjectDetails';

const page = () => {
    const project = {
  _id: "1",
  title: "A React Project for Beginners",
  description:
    "This project is designed to help new developers understand how to build and collaborate using React. We focus on learning best practices, GitHub collaboration, and modern UI design.",
  githubRepo: "https://github.com/example/react-beginner",
  projectType: "open source",
  teamSize: "7",
  collaborationType: "remote",
  contactPreference: "discord",
  skills: ["Express", "Python", "Node.js", "Next.js"],
  teamMembers: [
    { name: "Sarah Ahmed", position: "Project Lead / Frontend Developer" },
    { name: "Jamil Khan", position: "Backend Developer" },
    { name: "Anika Chowdhury", position: "UI/UX Designer" },
    { name: "Rafiul Hasan", position: "Full Stack Developer" },
    { name: "Nadia Rahman", position: "QA Engineer" },
    { name: "Omar Faruk", position: "DevOps Engineer" },
    { name: "Tanjim Islam", position: "Documentation & Community Manager" },
  ],
};

    return (
        <div>
            <ProjectDetails project={project}/>
        </div>
    );
};

export default page;