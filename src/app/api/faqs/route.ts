import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await dbConnect("faqs");

    const faqs = await collection.find({}).toArray();

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("FAQ fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load FAQs", details: String(error) },
      { status: 500 }
    );
  }
}
