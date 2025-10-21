"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  Bus,
  Train,
  Rocket,
  Ship,
  CreditCard,
  Globe,
  Star,
  BedDouble,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// --- Icons with color ---
const icons = {
  Bus: <Bus size={40} className="text-blue-500" />,
  Train: <Train size={40} className="text-green-500" />,
  Rocket: <Rocket size={40} className="text-red-500" />,
  Ship: <Ship size={40} className="text-indigo-500" />,
  CreditCard: <CreditCard size={40} className="text-yellow-500" />,
  Globe: <Globe size={40} className="text-teal-500" />,
  Star: <Star size={40} className="text-pink-500" />,
  BedDouble: <BedDouble size={40} className="text-purple-500" />,
} as const;

type IconKey = keyof typeof icons;

// --- Services Data (typed) ---
type Service = {
  iconName: IconKey;
  title: string;
  description?: string;
};

const services: Service[] = [
  {
    iconName: "Bus",
    title: "Bus",
    description: "Comfortable bus tours across Bangladesh.",
  },
  {
    iconName: "Train",
    title: "Train",
    description: "Enjoy scenic train journeys to famous destinations.",
  },
  {
    iconName: "Rocket",
    title: "Helicopter",
    description: "Fast and aerial view of top tourist spots.",
  },
  {
    iconName: "Ship",
    title: "Launch/Boat",
    description: "Relaxing boat rides on rivers and lakes.",
  },
  {
    iconName: "CreditCard",
    title: "Secure Payments",
    description: "Your transactions are safe with our secure payment system.",
  },
  {
    iconName: "Globe",
    title: "Trusted",
    description: "Trusted by thousands of travelers across Bangladesh.",
  },
  {
    iconName: "Star",
    title: "Reviews",
    description: "Rated highly by our happy customers for excellent service.",
  },
  {
    iconName: "BedDouble",
    title: "Comfortable Stays",
    description: "Enjoy comfortable stays with all necessary amenities.",
  },
];

// --- Framer Motion Variants ---
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

// Use an easing that matches Framer Motion's `Easing` type: a cubic-bezier array
const item: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// --- Component ---
const WhyChooseUs: React.FC = () => {
  return (
    <section className="w-full py-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Why Choose <span className="text-blue-600">SixTour</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We provide the best travel experience with comfort, safety, and
            satisfaction. Here’s why travelers love us:
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Card className="group bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="flex flex-col items-center justify-center space-y-4 py-6">
                  <div className="p-4 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 group-hover:scale-110 transform transition">
                    {icons[service.iconName]}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
