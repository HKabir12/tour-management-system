import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookings = await dbConnect("bookings");
    const { status } = await req.json(); // status = "approved" বা "paid"

    const result = await bookings.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Booking update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await dbConnect("bookings");
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID missing" },
        { status: 400 }
      );
    }

    // Find the booking first
    const booking = await db.findOne({ _id: new ObjectId(bookingId) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: "You cannot cancel this booking" },
        { status: 403 }
      );
    }

    if (booking.paymentStatus === "paid") {
      return NextResponse.json(
        { error: "Cannot cancel a paid booking" },
        { status: 400 }
      );
    }

    await db.deleteOne({ _id: new ObjectId(bookingId) });

    return NextResponse.json(
      { message: "Booking cancelled successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}