"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader } from "@/components/utilities/Loader";

interface Tour {
  _id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  costFrom: number;
  maxGuest: number;
  division: string;
}

export default function SmartBudgetTour() {
  const router = useRouter();
  const [budget, setBudget] = useState<string>("");
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce timer
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!budget) {
      setTours([]);
      return;
    }

    // Clear previous timer
    if (timer) clearTimeout(timer);

    // Set new timer to fetch after 500ms
    const newTimer = setTimeout(() => {
      fetchTours();
    }, 500);

    setTimer(newTimer);

    return () => {
      if (newTimer) clearTimeout(newTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budget]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tours/budget?budget=${budget}`);
      const data: Tour[] = await res.json();
      if (!res.ok) throw new Error("Failed to fetch tours");
      setTours(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch tours. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDetails = (tourId: string) => {
    router.push(`/tours/${tourId}`);
  };

  return (
    <div className="space-y-6">
      {/* Budget Input */}
      <div className="flex justify-center items-center gap-2">
        <input
          type="number"
          placeholder="Enter your budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      {/* Tours List */}
      {loading && <Loader />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour._id}
            className="border rounded-lg shadow-sm p-4 flex flex-col"
          >
            {tour.images[0] && (
              <Image
                src={tour.images[0]}
                alt={tour.title}
                width={400}
                height={250}
                className="rounded-md object-cover mb-2"
              />
            )}
            <h2 className="text-lg font-bold">{tour.title}</h2>
            <p className="text-gray-600 mb-2">{tour.location}</p>
            <p className="mb-2">From ৳{tour.costFrom.toLocaleString()}</p>
            <p className="mb-2">Max Guests: {tour.maxGuest}</p>
            <p className="text-sm text-gray-500 mb-2">{tour.division}</p>
            <Button onClick={() => handleDetails(tour._id)}>
              Details Now
            </Button>
          </div>
        ))}
      </div>

      {!loading && tours.length === 0 && budget && (
        <p className="text-center text-gray-500">No tours found for this budget.</p>
      )}
    </div>
  );
}
