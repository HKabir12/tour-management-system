"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import TourFilters from "@/components/pages/TourFilters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ITourPackage {
  _id: string;
  title: string;
  description: string;
  slug: string;
  images: string[];
  costFrom: number;
  maxGuest: number;
  departureLocation: string;
  arrivalLocation: string;
  minAge: number;
  tourPlan: string[];
  amenities: string[];
}

export default function Tours() {
  const [tours, setTours] = useState<ITourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const division = searchParams.get("division");
  const tourType = searchParams.get("tourType");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        let url = `/api/tours`;
        const params = [];
        if (division) params.push(`division=${division}`);
        if (tourType) params.push(`tourType=${tourType}`);
        if (params.length) url += `?${params.join("&")}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load tours");

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setTours(data);
        } else {
          const text = await res.text();
          throw new Error("Expected JSON, got: " + text.slice(0, 100));
        }
      } catch (err: Error | unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [division, tourType]);

  if (loading) return <div className="text-center mt-10">Loading tours...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (tours.length === 0)
    return (
      <div className="text-center text-muted-foreground mt-10">
        No tours found.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 🧭 Mobile Filter Button */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h1 className="text-2xl font-semibold">Available Tours</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Filter</Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[80%] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Tours</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <TourFilters />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* 🌍 Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Desktop Filters */}
        <div className="hidden lg:block lg:col-span-3">
          <TourFilters />
        </div>

        {/* Tour List */}
        <div className="lg:col-span-9 space-y-6">
          {tours.map((item) => (
            <div
              key={item._id}
              className="border border-muted rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row transition hover:shadow-lg"
            >
              <div className="md:w-2/5 w-full relative h-56 md:h-auto">
                <Image
                  src={item.images?.[0] || "/placeholder.jpg"}
                  fill
                  alt={item.title}
                  className="object-cover"
                />
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-3 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary">
                      From ৳{item.costFrom.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Max {item.maxGuest} guests
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <span className="font-medium">From:</span>{" "}
                      {item.departureLocation}
                    </div>
                    <div>
                      <span className="font-medium">To:</span>{" "}
                      {item.arrivalLocation}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {item.tourPlan?.length || 0} days
                    </div>
                    <div>
                      <span className="font-medium">Min Age:</span> {item.minAge}+
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.amenities?.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-muted/50 text-primary text-xs rounded-full"
                      >
                        {a}
                      </span>
                    ))}
                    {item.amenities?.length > 3 && (
                      <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-full">
                        +{item.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <Button asChild className="w-full mt-auto">
                  <Link href={`/tours/${item._id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
