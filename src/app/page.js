import Image from "next/image";
import HeroSection from "../Components/home/HeroSection";
import TechStackSection from "../Components/home/TechStackSection";
import HowItWorks from "../Components/home/HowItWorksSection";
import FAQ from "../Components/home/FAQSection";
import TestimonialCarousel from "../Components/home/TestimonialCarousel";
import ProjectsPage from "./projects/[id]/page";
import ProjectList from "../Components/home/ProjectsList";
import BlogPage from "../Components/Blog/BlogPage";
import {CommunityStats} from "../Components/shared/CommunityStats"
import { CommunityDiscussions } from "../Components/home/CommunityDiscussions";


export default function Home() {
  return (
    <div>
     <HeroSection></HeroSection>
     <HowItWorks></HowItWorks>
     <TechStackSection></TechStackSection>
     <ProjectList limit={6}></ProjectList>
     <CommunityDiscussions></CommunityDiscussions>
     <TestimonialCarousel></TestimonialCarousel>
     <BlogPage></BlogPage>
     <FAQ></FAQ>
    </div>
  );
}
