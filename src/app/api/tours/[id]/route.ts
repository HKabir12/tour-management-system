
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

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const users = await dbConnect("user"); // your collection name
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const userId = params.id;

    // findOneAndUpdate may return null, so handle it
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { name } },
      { returnDocument: "after" }
    );

    if (!result || !result.value) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ result.value is now guaranteed to exist here
    return NextResponse.json(result.value, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
