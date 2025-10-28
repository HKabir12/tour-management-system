import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await dbConnect("travelers");
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch travelers" },
      { status: 500 }
    );
  }
}
