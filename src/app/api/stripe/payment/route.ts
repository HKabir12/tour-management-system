import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover", // matches the type
});
interface CustomError {
  message?: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email: string | null = searchParams.get("email"); // optional filter

    // Fetch last 50 checkout sessions
    const sessions = await stripe.checkout.sessions.list({ limit: 50 });

    // Only successful payments
    const successful = sessions.data.filter(
      (s: Stripe.Checkout.Session) => s.payment_status === "paid"
    );

    // Filter by email if provided
    const filtered = email
      ? successful.filter(
          (s: Stripe.Checkout.Session) =>
            s.customer_details?.email === email || s.metadata?.userEmail === email
        )
      : successful;

    return NextResponse.json({ payments: filtered }, { status: 200 });
  } catch (err: unknown) {
  const error = err as CustomError;
  return NextResponse.json(
    { error: error.message || "Failed to create session" },
    { status: 500 }
  );
}
}
