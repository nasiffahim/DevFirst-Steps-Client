import Image from "next/image";
import HeroSection from "../Components/home/HeroSection";
import ProjectsPage from "./projects/[id]/page";
import ProjectList from "@/Components/home/ProjectsList";

export default function Home() {
  return (
    <div className="min-h-screen">
     <HeroSection></HeroSection>
     <ProjectList limit={3}></ProjectList>
    </div>
  );
}
