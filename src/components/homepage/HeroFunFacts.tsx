"use client";

import React, { useEffect, useState } from "react";
import {
  FaMapMarkedAlt,
  FaUserFriends,
  FaShip,
  FaHotel,
  FaPlane,
  FaStar,
  FaBed,
  FaBus,
} from "react-icons/fa";
import { Loader } from "../utilities/Loader";

interface Fact {
  icon: string;
  label: string;
  count: number;
}

const iconMap: Record<string, React.ReactNode> = {
  FaMapMarkedAlt: <FaMapMarkedAlt className="text-5xl text-blue-400" />,
  FaUserFriends: <FaUserFriends className="text-5xl text-green-400" />,
  FaShip: <FaShip className="text-5xl text-purple-400" />,
  FaHotel: <FaHotel className="text-5xl text-red-400" />,
  FaPlane: <FaPlane className="text-5xl text-yellow-400" />,
  FaStar: <FaStar className="text-5xl text-pink-400" />,
  FaBed: <FaBed className="text-5xl text-indigo-400" />,
  FaBus: <FaBus className="text-5xl text-teal-400" />,
};


export default function HeroFunFacts() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacts = async () => {
      try {
        const res = await fetch("/api/facts");
        const data = await res.json();
        setFacts(data);
      } catch (err) {
        console.error("Failed to fetch facts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacts();
  }, []);

  if (loading) {
    return (
      <Loader></Loader>
    );
  }

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
      <div className="max-w-6xl mx-auto text-center px-4">
        <h2 className="text-4xl font-extrabold mb-10 text-gray-900 dark:text-white">
          Our Growing Achievements
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {facts.map((fact, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:scale-105 transition-transform duration-300"
            >
              {iconMap[fact.icon]}
              <h3 className="text-2xl font-bold mt-3 text-blue-600 dark:text-blue-400 counter">
                {fact.count.toLocaleString()}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{fact.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
