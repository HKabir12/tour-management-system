import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const db = await dbConnect("facts"); // or your DB name
    // Example: Fetch data dynamically if you store them in MongoDB
    const stats = await db.find({}).toArray();

    // If you don’t have a collection yet, return sample fallback data:
  
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching facts:", error);
    return NextResponse.json({ message: "Failed to fetch facts" }, { status: 500 });
  }
}
