
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // params await করতে হবে
    const collection = await dbConnect("tours");

    const tour = await collection.findOne({ _id: new ObjectId(id) });

    if (!tour) {
      return NextResponse.json({ message: "Tour not found" }, { status: 404 });
    }

    return NextResponse.json(tour, { status: 200 });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }
}
