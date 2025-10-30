import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Promise
) {
  try {
    const { id } = await context.params; // ✅ await করতে হবে
    const bookings = await dbConnect("bookings");

    const { status } = await req.json(); // status = "approved" বা "paid"

    const result = await bookings.updateOne(
      { _id: new ObjectId(id) },
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



export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Promise
) {
  try {
    const { id } = await context.params; // ✅ await করা লাগবে
    const bookings = await dbConnect("bookings");

    const booking = await bookings.findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Optional: যদি শুধু rejected bookings মুছে দিতে চান
    if (booking.status !== "rejected") {
      return NextResponse.json(
        { error: "Only rejected bookings can be deleted" },
        { status: 403 }
      );
    }

    await bookings.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
  } catch (err) {
    console.error("Delete booking error:", err);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}