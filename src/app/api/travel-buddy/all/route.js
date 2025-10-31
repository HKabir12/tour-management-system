import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const collection = await dbConnect("travel_buddies");
    const buddies = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, buddies });
  } catch (error) {
    console.error("Error fetching travel buddies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
