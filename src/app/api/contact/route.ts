import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const collection = await dbConnect("contacts");

    const result = await collection.insertOne({
      name,
      email,
      subject,
      message,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ message: "Message sent successfully", id: result.insertedId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
