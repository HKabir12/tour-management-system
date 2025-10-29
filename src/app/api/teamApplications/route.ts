import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, position } = body;

    if (!name || !email || !position) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const collection = await dbConnect("teamApplications");

    const result = await collection.insertOne({
      name,
      email,
      position,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: "Application submitted successfully",
        id: result.insertedId,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving application:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
