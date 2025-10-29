"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Loader } from "@/components/utilities/Loader";

interface Tour {
  _id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  costFrom: number;
  maxGuest: number;
  startDate: string;
  endDate: string;
  departureLocation: string;
  arrivalLocation: string;
  division: string;
  tourType: string;
  minAge: number;
  amenities: string[];
  included: string[];
  excluded: string[];
  tourPlan: string[];
}

export default function TourDetails() {
  const { id } = useParams();
  const [tourData, setTourData] = useState<Tour | null>(null);
  const [division, setDivision] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch tour details
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/${id}`);
        const data = await res.json();
        setTourData(data);
      } catch (err) {
        console.error("Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTour();
  }, [id]);

  // ✅ Fetch division name
  useEffect(() => {
    if (!tourData?.division) return;
    const fetchDivision = async () => {
      try {
        const res = await fetch(`/api/divisions/${tourData.division}`);
        const data = await res.json();
        setDivision(data?.name || "");
      } catch (err) {
        console.error("Error fetching division:", err);
      }
    };
    fetchDivision();
  }, [tourData]);

  if (loading || !tourData) {
    return <Loader></Loader>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{tourData.title}</h1>
          <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
            <span>📍 {tourData.location}</span>
            <span>💰 From ৳{tourData.costFrom.toLocaleString()}</span>
            <span>👥 Max {tourData.maxGuest} guests</span>
          </div>
        </div>
        <Button asChild>
          <Link href={`/booking/${tourData._id}`}>Book Now</Link>
        </Button>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tourData.images?.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`${tourData.title} ${index + 1}`}
            width={500}
            height={300}
            className="w-full h-48 object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Tour Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Tour Details</h2>
          <div className="space-y-2">
            <p>
              <strong>Dates:</strong>{" "}
              {format(new Date(tourData.startDate), "PP")} -{" "}
              {format(new Date(tourData.endDate), "PP")}
            </p>
            <p>
              <strong>Departure:</strong> {tourData.departureLocation}
            </p>
            <p>
              <strong>Arrival:</strong> {tourData.arrivalLocation}
            </p>
            <p>
              <strong>Division:</strong> {division ||tourData.arrivalLocation }
            </p>
            <p>
              <strong>Tour Type:</strong> {tourData.tourType}
            </p>
            <p>
              <strong>Min Age:</strong> {tourData.minAge} years
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <p className="text-muted-foreground">{tourData.description}</p>
        </div>
      </div>

      {/* Amenities / Included / Excluded */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
          <ul className="space-y-1">
            {tourData.amenities?.map((a, i) => (
              <li key={i} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> {a}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Included</h3>
          <ul className="space-y-1">
            {tourData.included?.map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-3">Excluded</h3>
          <ul className="space-y-1">
            {tourData.excluded?.map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="text-red-500 mr-2">✗</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Tour Plan */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Tour Plan</h3>
        <ol className="space-y-2">
          {tourData.tourPlan?.map((plan, i) => (
            <li key={i} className="flex">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5">
                {i + 1}
              </span>
              {plan}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
