import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const collection = await dbConnect("travel_buddies");

    const matches = await collection
      .find({
        from: { $regex: from || "", $options: "i" },
        to: { $regex: to || "", $options: "i" },
      })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, matches });
  } catch (error) {
    console.error("Error finding travel buddies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to find buddies" },
      { status: 500 }
    );
  }
}
