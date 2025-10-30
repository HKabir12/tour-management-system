import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

/**
 * Update user role
 * @route PUT /api/users/[id]
 */
export async function PUT(
 req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
     const { id } = await context.params; 
    const body = await req.json();
    const { role } = body as { role?: string };

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const users = await dbConnect("user");
    const result = await users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Role updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

/**
 * Delete user
 * @route DELETE /api/users/[id]
 */
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
     const { id } = await context.params; 
    const users = await dbConnect("user");
    const result = await users.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
