import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const collection = await dbConnect("divisions");
    const divisions = await collection.find({}).toArray();
    return NextResponse.json(divisions, { status: 200 });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return NextResponse.json({ message: "Failed to load divisions" }, { status: 500 });
  }
}
