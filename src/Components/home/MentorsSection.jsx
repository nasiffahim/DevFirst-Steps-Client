"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { Award, Star, Mail, Code } from "lucide-react";
import useAxiosSecure from "../../app/hooks/useAxiosSecure";
import "swiper/css";
import "swiper/css/effect-coverflow";
import Link from "next/link";
import useAuth from "../../app/hooks/useAuth";

const MentorHeroSection = () => {
  const { user } = useAuth(); 
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axiosSecure.get("/mentors");
        setMentors(res.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching mentors:", error);
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const getBadgeColor = (badge) => {
    switch (badge?.toLowerCase()) {
      case "platinum":
        return "from-slate-300 to-slate-500";
      case "gold":
        return "from-yellow-400 to-yellow-600";
      case "silver":
        return "from-gray-300 to-gray-500";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const handleFindMentor = () => {
    if (user) {
      router.push("/dashboard/find-mentor");
    } else {
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-slate-900 dark:text-white text-xl">Loading mentors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-slate-900 dark:text-white">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/20 dark:to-purple-600/20 border border-blue-500/20 dark:border-blue-500/30 rounded-full text-sm font-medium backdrop-blur-sm">
                    ✨ Expert Guidance Awaits
                  </span>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Choose From Our
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Finest Mentors
                  </span>
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  Connect with industry experts who are passionate about guiding
                  you through your journey. Get personalized mentorship from
                  professionals who have walked the path you're on.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={handleFindMentor} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                  Find Your Mentor
                </button>

                <button className="px-8 py-4 bg-slate-200 dark:bg-white/10 backdrop-blur-sm border border-slate-300 dark:border-white/20 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-white/20 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Content - Swiper Carousel */}
            <div className="w-full">
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                initialSlide={2}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                slidesPerView={"auto"}
                speed={600}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 80,
                  depth: 350,
                  modifier: 1,
                  slideShadows: true,
                }}
                modules={[EffectCoverflow, Autoplay]}
                className="mentor-swiper"
              >
                {mentors.map((mentor) => (
                  <SwiperSlide key={mentor._id}>
                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
                      {/* Background Image */}
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{
                          backgroundImage: `url(${
                            mentor.photoURL || mentor.image
                          })`,
                        }}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        <div
                          className={`px-3 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(
                            mentor.badge
                          )} flex items-center gap-1 shadow-lg`}
                        >
                          <Award className="w-4 h-4 text-white" />
                          <span className="text-xs font-bold text-white">
                            {mentor.badge}
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs font-bold text-white">
                            {mentor.points}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        {/* Always visible */}

                        {/* Visible on hover */}
                        <div className="space-y-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          <div className="mb-4 transform transition-all duration-500 group-hover:-translate-y-2">
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {mentor.displayName}
                            </h3>
                            <p className="text-sm text-blue-400 font-medium">
                              {mentor.experience} years experience
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                              <Mail className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="text-sm text-slate-300 truncate">
                              {mentor.email}
                            </span>
                          </div>

                          <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <Code className="w-4 h-4 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-wrap gap-1">
                                {mentor.expertise
                                  .split(",")
                                  .slice(0, 3)
                                  .map((tech, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded text-xs text-white"
                                    >
                                      {tech.trim()}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>

                          <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorHeroSection;