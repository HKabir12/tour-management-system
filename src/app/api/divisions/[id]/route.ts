import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params; 
    const collection = await dbConnect("divisions");

    // _id string হিসেবে fetch করা
    const division = await collection.findOne<{ _id: string; name: string }>({ _id: id });

    if (!division) {
      return NextResponse.json({ message: "Division not found" }, { status: 404 });
    }

    return NextResponse.json(division, { status: 200 });
  } catch (error) {
    console.error("Error fetching division:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
