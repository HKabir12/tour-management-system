import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await dbConnect("tours");
    const tour = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!tour) {
      return Response.json({ message: "Tour not found" }, { status: 404 });
    }

    return Response.json(tour, { status: 200 });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return Response.json({ message: "Invalid ID" }, { status: 400 });
  }
}
