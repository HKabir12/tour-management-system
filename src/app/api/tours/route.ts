import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: Request) {
  try {
    const collection = await dbConnect("tours");

    const url = new URL(req.url);
    const division = url.searchParams.get("division");
    const tourType = url.searchParams.get("tourType");

    const filter: Record<string, string> = {};
    if (division) filter.division = division;
    if (tourType) filter.tourType = tourType;

    const tours = await collection.find(filter).toArray();

    return Response.json(tours, { status: 200 });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return Response.json({ message: "Failed to load tours" }, { status: 500 });
  }
}
