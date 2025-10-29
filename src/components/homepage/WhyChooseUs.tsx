"use client";

import React, { useEffect, useState } from "react";
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
import { Loader } from "../utilities/Loader";

// --- Icons mapping ---
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

type IconName = keyof typeof icons;

interface Service {
  _id: string;
  iconName: IconName;
  title: string;
  description: string;
}

// --- Framer Motion variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

// --- Component ---
const WhyChooseUs: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error("Failed to fetch services");

        const data: Service[] = await res.json();
        setServices(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;

  return (
    <section className="w-full py-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
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
            We provide the best travel experience with comfort, safety, and satisfaction. 
            Here’s why travelers love us:
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service) => (
            <motion.div key={service._id} variants={itemVariants}>
              <Card className="group bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="flex flex-col items-center justify-center py-4">
                  <div className="p-2 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-800 group-hover:scale-110 transform transition">
                    {icons[service.iconName]}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2">
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
