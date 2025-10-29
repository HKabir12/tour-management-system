import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Connecting to DB...");
    const collection = await dbConnect("faqs");
    console.log("Connected successfully!");

    const faqs = await collection.find({}).toArray();
    console.log("FAQs loaded:", faqs.length);

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("FAQ fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load FAQs", details: String(error) },
      { status: 500 }
    );
  }
}
