import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import dbConnect from "@/lib/dbConnect";


// ✅ Utility function to read file as buffer
async function fileToBase64(file: File | null): Promise<string | null> {
  if (!file) return null;
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function POST(req: Request) {
  try {
    // ✅ Get multipart form data
    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;
    const imageFile = formData.get("image") as File | null;

    // ✅ Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields (name, email, password) are required" },
        { status: 400 }
      );
    }

    const collection = await dbConnect("users");

    // ✅ Check if user already exists
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ Convert image to Base64 for simple storage
    const imageBase64 = await fileToBase64(imageFile);

    // ✅ Hash password
    const hashedPassword = await hash(password, 10);

    // ✅ Prepare user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      image: imageBase64, // store image as Base64 (or URL if using Cloudinary)
      createdAt: new Date(),
    };

    // ✅ Insert user into MongoDB
    const result = await collection.insertOne(newUser);

    return NextResponse.json(
      {
        message: "User registered successfully ✅",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Register API Error:", error);
    return NextResponse.json(
      { message: "Internal server error during registration" },
      { status: 500 }
    );
  }
}
