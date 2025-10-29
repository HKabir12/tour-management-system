import dbConnect from "@/lib/dbConnect";


export async function GET() {
  try {
    const collection = await dbConnect("services");
    const services = await collection.find({}).toArray();

    return new Response(JSON.stringify(services), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching services:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
