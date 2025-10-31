import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

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