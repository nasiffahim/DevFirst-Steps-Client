import React from "react";
import { User, GraduationCap, Briefcase, Wrench, FileText } from "lucide-react";

export default function EmptyProfileSection({ type }) {
  let icon, title, message;

  switch (type) {
    case "education":
      icon = <GraduationCap className="w-6 h-6 text-gray-400" />;
      title = "No Education Added";
      message = "Add your educational background to showcase your qualifications.";
      break;
    case "experience":
      icon = <Briefcase className="w-6 h-6 text-gray-400" />;
      title = "No Work Experience Added";
      message = "Add your work experience to highlight your professional journey.";
      break;
    case "skills":
      icon = <Wrench className="w-6 h-6 text-gray-400" />;
      title = "No Skills / Technologies Added";
      message = "Add your skills and technologies to show your expertise.";
      break;
    case "links":
      icon = <FileText className="w-6 h-6 text-gray-400" />;
      title = "No Links Added";
      message = "Add your LinkedIn, GitHub, or resume links for better visibility.";
      break;
    default:
      icon = <User className="w-6 h-6 text-gray-400" />;
      title = "No Information Added";
      message = "You haven't added any information yet.";
      break;
  }

  return (
    <div className="border rounded-2xl bg-white dark:bg-gray-900 shadow-md max-w-2xl mx-auto mt-8 p-6 flex items-center gap-4">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
}
