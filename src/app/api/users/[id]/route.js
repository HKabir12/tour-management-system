import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

// Update role
export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    const { role } = body;
    if (!role) return Response.json({ error: "Role is required" }, { status: 400 });

    const collection = await dbConnect("user");
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { role } }
    );

    if (result.matchedCount === 0)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}

// Delete user
export async function DELETE(req, { params }) {
  try {
    const collection = await dbConnect("user");
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0)
      return Response.json({ error: "User not found" }, { status: 404 });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
