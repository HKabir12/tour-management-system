"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Loader } from "@/components/utilities/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const { id } = useParams();
 

  const [tourData, setTourData] = useState<Tour | null>(null);
  const [division, setDivision] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<
    "none" | "pending" | "approved" | "paid"
  >("none");

  // Fetch tour details
  useEffect(() => {
    if (!id) return;

    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/${id}`);
        const data: Tour = await res.json();
        setTourData(data);
      } catch (err) {
        console.error("Error fetching tour:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);


  useEffect(() => {
    if (!tourData?.division) return;

    const fetchDivision = async () => {
      try {
        const res = await fetch(`/api/divisions/${tourData.division}`);
        if (!res.ok) {
          setDivision("Unknown Division");
          return;
        }

        const data: { _id: string; name: string } = await res.json();
        setDivision(data?.name || "Unknown Division");
      } catch (err) {
        console.error("Error fetching division:", err);
        setDivision("Unknown Division");
      }
    };

    fetchDivision();
  }, [tourData]);

  // Poll booking status
  useEffect(() => {
    if (!session?.user?.email || !tourData?._id) return;

    const fetchBookingStatus = async () => {
      try {
        const res = await fetch(
          `/api/bookings?tourId=${tourData._id}&email=${session.user.email}`
        );
        if (!res.ok) return;
        const data = await res.json();

        if (data.booking) {
          setBookingStatus(data.booking.status);
        } else {
          setBookingStatus("none");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBookingStatus(); // check immediately
    const interval = setInterval(fetchBookingStatus, 2000);

    return () => clearInterval(interval);
  }, [session, tourData]);

  // Handle booking
  const handleBooking = async () => {
    if (!tourData?._id) return;

    if (!session) {
      signIn();
      return;
    }

    try {
      setBookingLoading(true);

      const body = {
        tourId: tourData._id,
        title: tourData.title,
        costFrom: tourData.costFrom,
        maxGuest: tourData.maxGuest,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      if (res.ok) {
        setBookingStatus("pending");
        toast.success("Booking confirmed! Awaiting moderator approval.");
        setOpenModal(false);
      } else {
        const error = await res.json();
        toast.error(error?.error || "Booking failed. Try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Booking failed. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !tourData) return <Loader />;

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
        <Button
          onClick={() => setOpenModal(true)}
          disabled={bookingStatus !== "none" && bookingStatus !== "approved"}
          className={`${
            bookingStatus === "pending"
              ? "bg-yellow-500 cursor-not-allowed"
              : bookingStatus === "paid"
              ? "bg-green-500 cursor-not-allowed"
              : bookingStatus !== "none"
              ? "bg-gray-400 cursor-not-allowed"
              : ""
          }`}
        >
          {bookingStatus === "pending"
            ? "Pending Approval"
            : bookingStatus === "approved"
            ? "Pay Now"
            : bookingStatus === "paid"
            ? "Paid ✅"
            : bookingStatus !== "none"
            ? "Already Booked"
            : "Book Now"}
        </Button>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tourData.images?.map((image, idx) => (
          <Image
            key={idx}
            src={image}
            alt={`${tourData.title} ${idx + 1}`}
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
              <strong>Division:</strong> {division || tourData.arrivalLocation}
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

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you ready to book?</DialogTitle>
            <DialogDescription>
              Once confirmed, your booking will go for moderator approval.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="items-center justify-center flex">
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleBooking} disabled={bookingLoading}>
              {bookingLoading ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
