
import { NextResponse } from "next/server";

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
// post api *******************
export async function POST(req) {
  const collection = await dbConnect("wishlist");
  const { userId, tour } = await req.json(collection);

  // Prevent duplicates
  const existing = await collection.findOne({ userId, tourId: tour._id });
  if (existing) {
    return NextResponse.json(
      { message: "Already in collection" },
      { status: 400 }
    );
  }

  const newItem = await collection.insertOne({
    userId,
    tourId: tour._id,
    tourTitle: tour.title,
    tourImage: tour.image,
    price: tour.price,
  });

  return NextResponse.json(newItem, { status: 201 });
}
// get api Wishlist *********************
export async function GET() {
  const collection = await dbConnect("wishlist");

  const items = await collection.find().toArray();

  return NextResponse.json(items);
}
// DELETE api wishlist *******************
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    console.log("Deleting wishlist item:", id);

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const collection = await dbConnect("wishlist");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Removed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}