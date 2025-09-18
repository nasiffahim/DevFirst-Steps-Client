import Image from "next/image";
import HeroSection from "../Components/home/HeroSection";
import TechStackSection from "@/Components/home/TechStackSection";
import HowItWorks from "@/Components/home/HowItWorksSection";
import FAQ from "@/Components/home/FAQSection";
import { CommunityDiscussions } from "@/Components/home/DiscussionSection";
import TestimonialCarousel from "@/Components/home/TestimonialCarousel";

export default function Home() {
  return (
    <div className="min-h-screen">
     <HeroSection></HeroSection>
     <HowItWorks></HowItWorks>
     <TechStackSection></TechStackSection>
     <CommunityDiscussions></CommunityDiscussions>
     <TestimonialCarousel></TestimonialCarousel>
     <FAQ></FAQ>
    </div>
  );
}
