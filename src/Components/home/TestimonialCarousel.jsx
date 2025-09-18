'use client'
import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Alex M.",
      role: "Frontend Developer",
      initials: "AM",
      rating: 5,
      content: "As a beginner, I found amazing React projects that helped me learn the complete frontend stack. The project categorization made it so easy to find exactly what I needed.",
      bgColor: "bg-blue-500"
    },
    {
      id: 2,
      name: "Sarah K.",
      role: "Full Stack Developer", 
      initials: "SK",
      rating: 5,
      content: "This platform is a game changer. Found incredible open source projects that taught me new technologies and helped me build an impressive portfolio.",
      bgColor: "bg-purple-500"
    },
    {
      id: 3,
      name: "David Chen",
      role: "Mobile Developer",
      initials: "DC", 
      rating: 5,
      content: "The mobile development section has outstanding Flutter and React Native projects. Perfect for developers wanting to get into mobile development.",
      bgColor: "bg-green-500"
    },
    {
      id: 4,
      name: "Maya P.",
      role: "Backend Engineer",
      initials: "MP",
      rating: 5,
      content: "Discovered Node.js and Python projects that significantly improved my backend skills. The project difficulty levels are perfectly organized.",
      bgColor: "bg-orange-500"
    },
    {
      id: 5,
      name: "Jordan T.",
      role: "AI Developer",
      initials: "JT",
      rating: 5,
      content: "The AI/ML section is incredible! Found TensorFlow and PyTorch projects that helped me transition from traditional development to machine learning.",
      bgColor: "bg-red-500"
    },
    {
      id: 6,
      name: "Lisa Wang",
      role: "Game Developer",
      initials: "LW",
      rating: 5,
      content: "Amazing collection of Unity and game development projects. As someone new to game dev, this platform made finding beginner-friendly projects so much easier.",
      bgColor: "bg-pink-500"
    }
  ];

  const itemsPerView = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 3500);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, maxIndex]);

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerView);
  
  if (visibleTestimonials.length < itemsPerView) {
    visibleTestimonials.push(...testimonials.slice(0, itemsPerView - visibleTestimonials.length));
  }

  return (
    <div className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Experience the Difference
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            See how developers are finding their perfect projects and accelerating their learning journey
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg border border-gray-200"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg border border-gray-200"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${currentIndex}`}
                className="bg-gray-50 rounded-2xl p-8 border border-gray-200 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:bg-white"
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 text-base leading-relaxed">
                  {testimonial.content}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === currentIndex 
                    ? 'bg-blue-500 w-8' 
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;