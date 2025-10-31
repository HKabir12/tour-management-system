"use server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export interface Booking {
  id: string;
  tourName: string;
  image: string;
}

const paidBooking = async (email?: string): Promise<Booking[]> => {
  if (!email) return [];

  // ✅ connect to DB collections
  const dbBookings = await dbConnect("bookings");
  const dbTours = await dbConnect("tours");

  // ✅ find paid bookings for that user
  const userBookings = await dbBookings
    .find({ userEmail: email, paymentStatus: "paid" })
    .toArray();

  if (!userBookings.length) return [];

  // ✅ fetch related tours
  const result: Booking[] = [];
  for (const booking of userBookings) {
    const tour = await dbTours.findOne({ _id: new ObjectId(booking.tourId) });

    result.push({
      id: booking._id.toString(),
      tourName: tour?.title || booking.tourName || "Unknown Tour",
      image: tour?.images?.[0] || "/default.jpg",
    });
  }

  return result;
};

export default paidBooking;
