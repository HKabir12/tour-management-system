"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

// --- Testimonials Data ---
const testimonials = [
  {
    text: "Amazing tour experience! Everything was organized perfectly and the destinations were breathtaking.",
    name: "Rafiq Ahmed",
    image: "https://i.ibb.co.com/CKZHz6JY/kabir-resume.jpg",
  },
  {
    text: "Loved every moment. The booking process was super easy and customer service was excellent!",
    name: "Sabrina Rahman",
    image: "https://i.ibb.co.com/CKZHz6JY/kabir-resume.jpg",
  },
  {
    text: "Highly recommend this service. Comfortable transport and trustworthy tours.",
    name: "Karim Hossain",
    image: "https://i.ibb.co.com/CKZHz6JY/kabir-resume.jpg",
  },
  {
    text: "The guides were knowledgeable and friendly. It was a perfect blend of adventure and relaxation.",
    name: "Aisha Khan",
    image: "https://i.ibb.co.com/CKZHz6JY/kabir-resume.jpg",
  },
];

// --- Framer Motion Variants ---
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// --- Component ---
const TravelersSay = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            What Our <span className="text-blue-600">Travelers</span> Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hear from our happy travelers who explored Bangladesh with us.
            Their experiences inspire you to plan your next adventure confidently!
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {testimonials.map((t, i) => (
            <motion.div key={i} variants={item}>
              <Card className="bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <CardHeader className="flex flex-col items-center pt-8 pb-4">
                  <Image
                    src={t.image}
                    alt={t.name}
                    className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover shadow-md"
                    width={80}
                    height={80}
                  />
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="italic text-gray-600 dark:text-gray-300 mb-4">
                    “{t.text}”
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t.name}
                  </h3>
                  <div className="mt-2 h-1 w-12 bg-blue-500 rounded-full mx-auto"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TravelersSay;
