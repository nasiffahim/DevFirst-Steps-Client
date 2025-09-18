import Image from "next/image";
import HeroSection from "../Components/home/HeroSection";
import BlogPage from "../Components/Blog/BlogPage";


export default function Home() {
  return (
    <div>
     <HeroSection></HeroSection>
   <BlogPage></BlogPage>
    </div>
  );
}
