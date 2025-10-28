"use client";

import React, { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Traveler {
  _id: string;
  name: string;
  image: string;
  review: string;
  tourPlace: string;
  tourDate: string;
  fullDescription: string;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function TravelersSay() {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTraveler, setSelectedTraveler] = useState<Traveler | null>(null);

  useEffect(() => {
    const fetchTravelers = async () => {
      try {
        const res = await fetch("/api/travelers");
        const data = await res.json();
        setTravelers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTravelers();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading travelers...</p>;

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-8">
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
            Hear from our happy travelers who explored Bangladesh with us. Their experiences inspire you to plan your next adventure confidently!
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {travelers.map((t) => (
            <motion.div key={t._id} variants={item}>
              <Card
                className="bg-white/90 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedTraveler(t)}
              >
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
                  <p className="italic text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">
                    “{t.review}”
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.tourPlace} | {new Date(t.tourDate).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Modal */}
      <Dialog open={!!selectedTraveler} onOpenChange={() => setSelectedTraveler(null)}>
        <DialogContent className="max-w-lg rounded-3xl">
          {selectedTraveler && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTraveler.tourPlace}</DialogTitle>
                <DialogDescription>{selectedTraveler.fullDescription}</DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
