import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";

interface UpdatePaymentBody {
  sessionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdatePaymentBody = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const collection = await dbConnect("bookings");

    // Find and update the booking with this session ID
    const result = await collection.updateOne(
      { sessionId }, // Match by sessionId
      {
        $set: {
          paymentStatus: "paid",
          paidAt: new Date(),
          status: "confirmed", // Optional: update overall status
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Booking not found or already updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Payment status updated successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Update payment error:", err.message);
      return NextResponse.json(
        { error: err.message },
        { status: 500 }
      );
    }

    console.error("Update payment error:", err);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
