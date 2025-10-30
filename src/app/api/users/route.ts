import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/lib/dbConnect"; // your MongoDB connection helper

export async function GET() {
  try {
    const db = await dbConnect("user");
    const users = await db.find({}).toArray();
    return NextResponse.json(users, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const db = await dbConnect("user");
    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and Email are required" },
        { status: 400 }
      );
    }

    const exists = await db.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      name,
      email,
      role: role || "user",
      createdAt: new Date(),
    };

    await db.insertOne(newUser);
    return NextResponse.json(
      { message: "User added successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding user:", err);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const users = await dbConnect("user");
    const body = await req.json();
    const { name } = body;

    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const userId = params.id;
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { name } },
      { returnDocument: "after" }
    );

    if (!result || !result.value)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(result.value, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
