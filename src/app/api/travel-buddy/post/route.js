import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const collection = await dbConnect("travel_buddies");
    const body = await req.json();

    const newBuddy = {
      ...body,
      userId: user.id,
      userEmail: user.email,
      createdAt: new Date(),
    };

    await collection.insertOne(newBuddy);

    return NextResponse.json({ success: true, buddy: newBuddy });
  } catch (error) {
    console.error("Error creating travel buddy:", error);
    return NextResponse.json({ success: false, message: "Failed to create post" }, { status: 500 });
  }
}
