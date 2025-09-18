import Image from "next/image";
import HeroSection from "../Components/home/HeroSection";
import TechStackSection from "@/Components/home/TechStackSection";
import HowItWorks from "@/Components/home/HowItWorksSection";
import FAQ from "@/Components/home/FAQSection";
import { CommunityDiscussions } from "@/Components/home/DiscussionSection";
import TestimonialCarousel from "@/Components/home/TestimonialCarousel";
import BlogPage from "@/Components/Blog/BlogPage";

export default function Home() {
  return (
    <div>
     <HeroSection></HeroSection>
     <HowItWorks></HowItWorks>
     <TechStackSection></TechStackSection>
     <CommunityDiscussions></CommunityDiscussions>
     <TestimonialCarousel></TestimonialCarousel>
     <FAQ></FAQ>
     <BlogPage></BlogPage>
    </div>
  );
}
