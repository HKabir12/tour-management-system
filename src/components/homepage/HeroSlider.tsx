"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    id: 1,
    title: "Sunny Getaway Sale",
    subtitle: "Amazing tours and travel packages",
    cta: "Explore Deals",
    offer: "Up To 40%",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    title: "Mountain Adventures",
    subtitle: "Trek, hike, and explore nature",
    cta: "Book Now",
    offer: "Save 30%",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    title: "City Heritage Tours",
    subtitle: "Discover history and culture",
    cta: "Discover More",
    offer: "Extra Nights Free",
    img: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  return (
    <section className="relative w-full overflow-hidden sm:px-4">
      <h1 className="text-center mt-6 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500">
        Explore the World with SixTour
      </h1>
      <p>
        <span className="text-center block mt-2 text-lg">
            Unforgettable Journeys Await You
             
        </span>
      </p>

      <div className="relative mt-6 h-[420px] sm:h-[480px] lg:h-[400px] overflow-hidden rounded-2xl shadow-2xl">
        <AnimatePresence>
          {SLIDES.map(
            (slide, index) =>
              index === current && (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full flex flex-col sm:flex-row"
                >
                  {/* Left Content */}
                  <div className="w-full sm:w-1/2 bg-gradient-to-r from-blue-600/90 to-sky-500/90 text-white p-8 sm:p-12 flex flex-col justify-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">
                      {slide.title}
                    </h2>
                    <p className="text-base md:text-lg mb-6 text-white/90">
                      {slide.subtitle}
                    </p>
                    <Button className="bg-orange-500 hover:bg-orange-600 rounded-full px-6 py-3 font-semibold w-fit">
                      {slide.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    {/* Decorative Plane */}
                    <Plane className="absolute top-40 right-6 text-white/70 animate-bounce" />
                  </div>

                  {/* Right Image */}
                  <div
                    className="w-full sm:w-1/2 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${slide.img})` }}
                  >
                    {/* Offer badge */}
                    <div className="absolute top-6 right-6 bg-purple-600/90 text-white px-5 py-3 rounded-full shadow-lg">
                      <p className="text-xs uppercase font-semibold tracking-wide">
                        Up To
                      </p>
                      <p className="text-xl font-bold">{slide.offer}</p>
                    </div>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        {/* Dots Navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-orange-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
