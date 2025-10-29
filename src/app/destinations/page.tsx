"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import { Loader } from "@/components/utilities/Loader";

type DestinationType = "Beach" | "Hill" | "Forest" | "Heritage" | "All";

interface Destination {
  _id: string;
  title: string;
  type: DestinationType;
  description: string;
  map: string;
}

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

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DestinationType>("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destinations");
        const data = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchType = filter === "All" || d.type === filter;
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
  }, [destinations, filter, search]);

  if (loading) return <Loader></Loader>;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-center md:text-left dark:text-gray-100">
          🌏 Explore Top Destinations
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <Select onValueChange={(v) => setFilter(v as DestinationType)} value={filter}>
            <SelectTrigger className="w-full md:w-[150px]">
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

          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 w-full border rounded-xl dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((place) => (
            <DestinationCard key={place._id} place={place} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
            No destinations found.
          </p>
        )}
      </div>
    </div>
  );
}
