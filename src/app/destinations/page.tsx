"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  
  Waves,
  Mountain,
  TreeDeciduous,
  Landmark,
  Filter,
  
} from "lucide-react";


import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// ----------------------------------------------------
// 🧭 Type Definitions
// ----------------------------------------------------
type DestinationType = "Beach" | "Hill" | "Forest" | "Heritage" | "All";

interface Destination {
  title: string;
  type: DestinationType;
  description: string;
  map: string;
}

// ----------------------------------------------------
// 🌍 Destination Data
// ----------------------------------------------------
const destinations: Destination[] = [
  {
    title: "Cox's Bazar Sea Beach",
    type: "Beach",
    description:
      "The world’s longest natural sea beach, perfect for watching breathtaking sunrises and sunsets.",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14613.12540706612!2d91.9742558!3d21.4272296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc9df6b6e2d19%3A0x47e7c6a72ccb316!2sCox's%20Bazar%20Sea%20Beach!5e0!3m2!1sen!2sbd!4v1695654444444",
  },
  {
    title: "Saint Martin’s Island",
    type: "Beach",
    description:
      "The only coral island in Bangladesh — famous for its crystal-clear blue water and marine beauty.",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3636.960764160204!2d92.3166595!3d20.6274219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ae20a0c0f65f4d%3A0x6e30a95df8333dcb!2sSaint%20Martin%E2%80%99s%20Island!5e0!3m2!1sen!2sbd!4v1695654999999",
  },
  {
    title: "Sajek Valley",
    type: "Hill",
    description:
      "Known as the 'Darjeeling of Bangladesh', Sajek Valley offers a magical experience above the clouds.",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.1239965812095!2d92.3265!3d23.3816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374559b0c885cc2b%3A0xa3e7d87b4c9b381c!2sSajek%20Valley!5e0!3m2!1sen!2sbd!4v1695655222222",
  },
  {
    title: "Sundarbans",
    type: "Forest",
    description:
      "The largest mangrove forest in the world and home to the majestic Royal Bengal Tiger.",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.2119158435713!2d89.1833!3d21.9497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ff59fb5dc50c3f%3A0x77e9a1b671a27d8f!2sSundarbans!5e0!3m2!1sen!2sbd!4v1695655555555",
  },
  {
    title: "Rangamati (Kaptai Lake)",
    type: "Hill",
    description:
      "A stunning blend of hills and water — famous for its scenic boat rides and natural beauty.",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3704.593808157453!2d92.2009!3d22.5166!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3745fb8dbdc85c55%3A0x4b7ac9f7c3b6e635!2sKaptai%20Lake!5e0!3m2!1sen!2sbd!4v1695655777777",
  },
  {
    title: "Bandarban (Nilgiri Hills)",
    type: "Hill",
    description:
      "One of the most spectacular hill spots in Bangladesh, where clouds meet the mountains.",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.632207407193!2d92.3574!3d21.9839!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37536e9c16c46c7d%3A0xd7a27b7d0e7c2bc2!2sNilgiri%20Hills!5e0!3m2!1sen!2sbd!4v1695656000000",
  },
  {
    title: "Paharpur (Somapura Mahavihara)",
    type: "Heritage",
    description:
      "A UNESCO World Heritage Site — one of the largest ancient Buddhist monasteries in South Asia.",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3738.4185225853857!2d88.9755!3d25.0274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fb9c8f2b60b2ed%3A0xadb53e9f61bb64e1!2sSomapura%20Mahavihara%2C%20Paharpur!5e0!3m2!1sen!2sbd!4v1695656333333",
  },
];

// ----------------------------------------------------
// 🎨 Type Icon Map
// ----------------------------------------------------
const typeMap: Record<
  DestinationType,
  { icon: React.ElementType; color: string; bg: string }
> = {
  Beach: { icon: Waves, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/50" },
  Hill: { icon: Mountain, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/50" },
  Forest: { icon: TreeDeciduous, color: "text-emerald-700", bg: "bg-emerald-100 dark:bg-emerald-900/50" },
  Heritage: { icon: Landmark, color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/50" },
  All: { icon: Filter, color: "text-gray-500", bg: "bg-gray-200 dark:bg-gray-600" },
};

// ----------------------------------------------------
// 🏞️ Destination Card Component
// ----------------------------------------------------
const DestinationCard: React.FC<{ place: Destination }> = ({ place }) => {
  const { icon: Icon, color, bg } = typeMap[place.type] ?? typeMap.All;
  return (
    <div className="bg-base-300 dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden hover:scale-[1.01] transition-all duration-300 border border-gray-200 dark:border-gray-700">
      <div className="h-64 w-full">
        <iframe
          title={place.title}
          src={place.map}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="rounded-t-3xl"
        ></iframe>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-extrabold dark:text-gray-100">{place.title}</h2>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${color} ${bg}`}
          >
            <Icon size={16} />
            {place.type}
          </span>
        </div>
        <p className="text-base dark:text-gray-300 border-l-4 border-blue-500 dark:border-blue-400 pl-3">
          {place.description}
        </p>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 🔍 Main Page Component
// ----------------------------------------------------
const DestinationsPage: React.FC = () => {
  const [filter, setFilter] = useState<DestinationType>("All");
  const [search, setSearch] = useState("");

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchType = filter === "All" || d.type === filter;
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [filter, search]);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-center md:text-left dark:text-gray-100">
          🌏 Explore Top Destinations
        </h1>

        {/* Filter & Search */}
        <div className="flex items-center gap-3">
          <Select onValueChange={(v: DestinationType) => setFilter(v)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Beach">Beach</SelectItem>
              <SelectItem value="Hill">Hill</SelectItem>
              <SelectItem value="Forest">Forest</SelectItem>
              <SelectItem value="Heritage">Heritage</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 border rounded-xl dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Destination Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((place, idx) => (
            <DestinationCard key={idx} place={place} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
            No destinations found.
          </p>
        )}
      </div>
    </div>
  );
};

export default DestinationsPage;
