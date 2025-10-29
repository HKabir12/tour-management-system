import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export async function POST(req, { params }) {
  try {
    const { id } = params;

    if (!id || id.length !== 24)
      return new Response(JSON.stringify({ message: "Invalid room id" }), { status: 400 });

    const roomsCollection = await dbConnect("rooms");

    // Update room
    await roomsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { available: false } }
    );

    // Return updated room to frontend
    const updatedRoom = await roomsCollection.findOne({ _id: new ObjectId(id) });

    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    console.error("Error booking room:", error);
    return new Response(JSON.stringify({ message: "Failed to book room" }), { status: 500 });
  }
}
