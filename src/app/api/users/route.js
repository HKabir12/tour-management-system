import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const collection = await dbConnect("user");
    const users = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return Response.json(users);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
