import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { PLACEHOLDERS } from '../utils/placeholderGenerator';

interface WinningPhoto {
  id: number;
  title: string;
  imageUrl: string;
  year: string;
}

const AchievementsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const winningPhotos: WinningPhoto[] = [
    {
      id: 1,
      title: "",
      imageUrl: "/images/achievement1.jpg",
      year: ""
    },
    {
      id: 2,
      title: "",
      imageUrl: "/images/achievement2.jpg",
      year: ""
    },
    {
      id: 3,
      title: "",
      imageUrl: "/images/achievement3.jpg",
      year: ""
    },
    {
      id: 4,
      title: "",
      imageUrl: "/images/achievement4.jpg",
      year: ""
    },
    {
      id: 5,
      title: "",
      imageUrl: "/images/achievement5.jpg",
      year: ""
    },
    {
      id: 6,
      title: "",
      imageUrl: "/images/achievement6.jpg",
      year: ""
    },
    {
      id: 7,
      title: "",
      imageUrl: "/images/achievement7.jpg",
      year: ""
    }
  ];

  const slideVariants = {
    enter: {
      x: 1000,
      opacity: 0
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: {
      zIndex: 0,
      x: -1000,
      opacity: 0
    }
  };

  const nextSlide = useCallback(() => {
    if (isTransitioning) return; // Prevent clicks during transition
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === winningPhotos.length - 1 ? 0 : prevIndex + 1
    );
    // Reset transition lock after animation completes
    setTimeout(() => setIsTransitioning(false), 800);
  }, [winningPhotos.length, isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return; // Prevent clicks during transition
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? winningPhotos.length - 1 : prevIndex - 1
    );
    // Reset transition lock after animation completes
    setTimeout(() => setIsTransitioning(false), 800);
  }, [winningPhotos.length, isTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 6000); // Increased to 6 seconds for better viewing time

    return () => clearInterval(interval);
  }, [nextSlide, isTransitioning]);

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="relative max-w-6xl mx-auto">
          {/* Carousel with Navigation Buttons */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 border border-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300 group"
              aria-label="Previous achievement"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {/* Carousel Container */}
            <div className="relative flex-1 h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden rounded-lg border border-primary/30">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "tween", duration: 0.6, ease: "easeInOut" },
                    opacity: { duration: 0.4 }
                  }}
                  className="absolute w-full h-full"
                >
                  <div className="relative w-full h-full overflow-hidden bg-black/50">
                    {/* Background Image - Clean without overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <OptimizedImage
                        src={winningPhotos[currentIndex].imageUrl}
                        alt={`Achievement ${currentIndex + 1}`}
                        className="max-w-full max-h-full object-contain"
                        priority={currentIndex === 0} // Preload first image
                        fallbackSrc={PLACEHOLDERS.ACHIEVEMENT}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 border border-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-black transition-all duration-300 group"
              aria-label="Next achievement"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Mobile-friendly indicators */}
          <div className="flex justify-center mt-4 sm:mt-6 gap-2">
            {winningPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'bg-primary shadow-sm shadow-primary'
                    : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsCarousel;
