"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const HeroSection = () => {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", { destination, date, people });
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.25 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="relative h-[500px] sm:h-[600px] lg:h-[400px] overflow-hidden sm:px-8">
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
        alt="Travel Adventure"
        className="absolute inset-0 w-full h-full object-cover "
        layout="fill"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/70" />

      {/* Animated Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full px-4"
      >
        <motion.h1
          variants={item}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mb-3 drop-shadow-lg"
        >
          Discover Your Next Adventure
        </motion.h1>
        <motion.p
          variants={item}
          className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
        >
          Find the perfect destination, book tours, and explore the world easily
          with SixTour.
        </motion.p>

        {/* Search Bar Card */}
        <motion.div variants={item} className="w-full max-w-4xl px-2 sm:px-6">
          <Card className="bg-white/90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-2xl">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            >
              <Input
                type="text"
                placeholder="Destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="flex-1 bg-white rounded-xl text-gray-800 focus-visible:ring-blue-500"
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-white rounded-xl text-gray-800 focus-visible:ring-blue-500"
              />
              <Input
                type="number"
                min="1"
                placeholder="Guests"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="flex-1 bg-white rounded-xl text-gray-800 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-xl sm:rounded-full"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
