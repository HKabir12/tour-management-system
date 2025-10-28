import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    const collection = await dbConnect("tourTypes");
    const tourTypes = await collection.find({}).toArray();
    return Response.json(tourTypes, { status: 200 });
  } catch (error) {
    console.error("Error fetching tour types:", error);
    return Response.json(
      { message: "Failed to load tour types" },
      { status: 500 }
    );
  }
}
