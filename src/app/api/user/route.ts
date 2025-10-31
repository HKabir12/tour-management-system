import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const usersCollection = await dbConnect("user");
  const user = await usersCollection.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image || "",
    role: user.role || "user",
  });
}
