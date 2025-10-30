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

  const bookingsCollection = await dbConnect("bookings");
  const tourCollection = await dbConnect("tours");

  const bookings = await bookingsCollection
    .find({ userEmail: email, paymentStatus: "paid" })
    .toArray();

  const result: Booking[] = [];

  for (const booking of bookings) {
    const tour = await tourCollection.findOne({ _id: new ObjectId(booking.tourId) });
    result.push({
      id: booking._id.toString(),
      tourName: booking.tourName,
      image: tour?.images?.[0] || "",
    });
  }

  return result;
};

export default paidBooking;
