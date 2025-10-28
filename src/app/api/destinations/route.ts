import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    
    const collection = await dbConnect("destinations");

    const destinations = await collection.find({}).toArray();

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { message: "Database error" },
      { status: 500 }
    );
  }
}
