
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await dbConnect("guides");
    const data = await collection.find({}).toArray();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error fetching guides:", err);
    return NextResponse.json(
      { message: "Server error fetching guides" },
      { status: 500 }
    );
  }
}
