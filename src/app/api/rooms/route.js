import dbConnect from "@/lib/dbConnect";

export async function GET() {
  try {
    const roomsCollection = await dbConnect("rooms");
    const rooms = await roomsCollection.find({}).toArray();

    //console.log("Fetched rooms:", rooms);

    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (error) {
    // console.error("Error fetching rooms:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch rooms" }), {
      status: 500,
    });
  }
}
