import Image from "next/image";
import HeroSection from "../Components/home/HeroSection";
import ProjectsPage from "./projects/[id]/page";

export default function Home() {
  return (
    <div className="min-h-screen">
     <HeroSection></HeroSection>
     <ProjectsPage></ProjectsPage>
    </div>
  );
}
