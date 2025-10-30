import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    
    const body = await req.json();
    const { tourId, title, costFrom, maxGuest } = body;

    if (!tourId || !title || costFrom == null || !maxGuest) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const bookings = await dbConnect("bookings");
    const existingBooking = await bookings.findOne({
      tourId: new ObjectId(tourId),
      userEmail: session.user.email,
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "You have already booked this tour." },
        { status: 400 }
      );
    }

    // ✅ Here we add userName
    const booking = {
      tourId: new ObjectId(tourId),
      title,
      costFrom,
      maxGuest,
      userEmail: session.user.email,
      userName: session.user.name || "",
      status: "pending",
      createdAt: new Date(),
    };

    const result = await bookings.insertOne(booking);

    return NextResponse.json(
      { message: "Booking created", bookingId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    const db = await dbConnect("bookings");

    // Fetch all bookings for this user, include all necessary tour info
    const bookings = await db.find({ userEmail: email }).toArray();

    // If you have tours collection, join additional info from there (title, costFrom, maxGuest)
    // For simplicity, assuming you saved them during booking
    return NextResponse.json(bookings, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}