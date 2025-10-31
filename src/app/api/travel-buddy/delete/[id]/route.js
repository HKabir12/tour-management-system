import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const collection = await dbConnect("travel_buddies");
    const buddy = await collection.findOne({ _id: new ObjectId(id) });

    if (!buddy) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    if (buddy.userEmail !== user.email) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    await collection.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting buddy:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
