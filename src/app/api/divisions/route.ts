import dbConnect from "@/lib/dbConnect";


export async function GET() {
  try {
    const collection = await dbConnect("divisions");
    const divisions = await collection.find({}).toArray();
    return Response.json(divisions, { status: 200 });
  } catch (error) {
    console.error("Error fetching divisions:", error);
    return Response.json({ message: "Failed to load divisions" }, { status: 500 });
  }
}
