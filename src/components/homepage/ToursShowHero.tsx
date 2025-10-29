"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/utilities/Loader";

interface ITourPackage {
  _id: string;
  title: string;
  description: string;
  images: string[];
  costFrom: number;
}

export default function ToursShowHero() {
  const [tours, setTours] = useState<ITourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/tours?limit=8`);
        if (!res.ok) throw new Error("Failed to load tours");

        const data = await res.json();
        setTours(data.slice(0, 8)); // fallback if backend doesn't support ?limit
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-10 text-primary">
          🌏 Explore Top Destinations
        </h2>

        {tours.length === 0 ? (
          <p className="text-muted-foreground">No tours available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours.map((tour) => (
              <div
                key={tour._id}
                className="border border-muted rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={tour.images?.[0] || "/placeholder.jpg"}
                    alt={tour.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4 text-left">
                  <h3 className="text-lg font-semibold mb-2">{tour.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {tour.description ||
                      "Experience the breathtaking beauty of this destination..."}
                  </p>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-bold text-primary">
                      From ৳{tour.costFrom.toLocaleString()}
                    </span>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/tours/${tour._id}`}>View Details</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Button asChild size="lg" className="text-lg">
            <Link href="/tours">Show All Tours</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
