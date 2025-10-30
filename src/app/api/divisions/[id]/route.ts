import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

// Type for a single division
interface Division {
  _id: ObjectId;
  name: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Convert string ID to MongoDB ObjectId
    const objectId = new ObjectId(id);

    const collection = await dbConnect("divisions");

    // Find the division by _id
    const division = await collection.findOne<Division>({ _id: objectId });

    if (!division) {
      return NextResponse.json({ message: "Division not found" }, { status: 404 });
    }

    // Optionally convert _id to string before returning
    const divisionResponse = {
      ...division,
      _id: division._id.toString(),
    };

    return NextResponse.json(divisionResponse, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching division:", error);

    let message = "Server error";
    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ message }, { status: 500 });
  }
}
