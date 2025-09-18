import Image from "next/image";
import HeroSection from "../Components/home/HeroSection";
import ProjectsPage from "./projects/[id]/page";
import ProjectList from "@/Components/home/ProjectsList";
import BlogPage from "@/Components/Blog/BlogPage";

export default function Home() {
  return (
    <div>
     <HeroSection></HeroSection>
     <ProjectList limit={3}></ProjectList>
     <BlogPage></BlogPage>
    </div>
  );
}
