import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

// Initialize Stripe with proper typing
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover", // matches the type
});
interface CustomError {
  message?: string;
}

interface CheckoutRequestBody {
  orderId: string;
  tourTitle: string;
  amount: string | number;
  userEmail: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutRequestBody = await req.json();

    const { orderId, tourTitle, amount, userEmail } = body;

    if (!orderId || !tourTitle || !amount || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const amountInCents = Math.round(Number(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    // Connect to MongoDB and get bookings collection
    const collection = await dbConnect("bookings");

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: tourTitle },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        orderId,
        userEmail,
        tourTitle,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tours/${orderId}`,
    });

    // Update booking in MongoDB with sessionId
    await collection.updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          sessionId: session.id,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      { url: session.url, sessionId: session.id },
      { status: 200 }
    );
  } catch (err: unknown) {
  const error = err as CustomError;
  return NextResponse.json(
    { error: error.message || "Failed to create session" },
    { status: 500 }
  );
}
}
