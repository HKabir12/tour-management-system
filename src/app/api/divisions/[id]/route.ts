import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await dbConnect("divisions");
    const division = await collection.findOne({ _id: new ObjectId(params.id) });
    if (!division) {
      return Response.json({ message: "Division not found" }, { status: 404 });
    }
    return Response.json(division, { status: 200 });
  } catch (error) {
    console.error("Error fetching division:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
