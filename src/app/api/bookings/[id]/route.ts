import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

interface Booking {
  _id: string;
  tourId: string;
  title: string;
  costFrom: number;
  maxGuest: number;
  status: "pending" | "approved" | "rejected" | "paid";
  sessionId?: string;
  userEmail?: string;
}

// ✅ GET booking by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const collection = await dbConnect("bookings");
    const booking = await collection.findOne<Booking>({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    console.error("GET booking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH booking → update status
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const { status } = await req.json();

    const collection = await dbConnect("bookings");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("PATCH booking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ DELETE booking → admin/moderator only, only if rejected
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const collection = await dbConnect("bookings");

    const booking = await collection.findOne<Booking>({ _id: new ObjectId(id) });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "rejected") {
      return NextResponse.json({ error: "Only rejected bookings can be deleted" }, { status: 403 });
    }

    // Only allow moderator/admin to delete
    if (session.user.role !== "moderator") {
      return NextResponse.json({ error: "Only moderator can delete bookings" }, { status: 403 });
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE booking error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
