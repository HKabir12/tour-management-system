import dbConnect from "@/lib/dbConnect";


export async function GET() {
  try {
    const collection = await dbConnect("teamMembers");
    const team = await collection.find({}).toArray();

    return new Response(JSON.stringify(team), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
