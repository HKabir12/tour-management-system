
// import dbConnect from "@/lib/dbConnect";

// export async function POST(req) {
//   try {
//     const { db } = await dbConnect();
//     const collection = db.collection("supportTickets");

//     const body = await req.json();
//     body.status = "Open";
//     body.createdAt = new Date();

//     const result = await collection.insertOne(body);

//     // return the actual inserted document
//     const ticket = await collection.findOne({ _id: result.insertedId });

//     return Response.json({ success: true, ticket });
//   } catch (error) {
//     return Response.json({ success: false, message: error.message });
//   }
// }

// export async function GET(req) {
//   try {
//     const { db } = await dbConnect();
//     const collection = db.collection("supportTickets");

//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");

//     const filter = userId ? { userId } : {};
//     const tickets = await collection
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .toArray();

//     return Response.json({ success: true, tickets });
//   } catch (error) {
//     return Response.json({ success: false, message: error.message });
//   }
// }



import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// ✅ Create new ticket
export async function POST(req) {
  try {
    const { db } = await dbConnect();
    const collection = db.collection("supportTickets");

    const body = await req.json();
    body.status = "Open";
    body.createdAt = new Date();

    const result = await collection.insertOne(body);
    const ticket = await collection.findOne({ _id: result.insertedId });

    return Response.json({ success: true, ticket });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

// ✅ Fetch tickets (all or by user)
export async function GET(req) {
  try {
    const { db } = await dbConnect();
    const collection = db.collection("supportTickets");

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const tickets = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({ success: true, tickets });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

// ✅ PATCH: admin reply or mark as resolved
export async function PATCH(req) {
  try {
    const { db } = await dbConnect();
    const collection = db.collection("supportTickets");

    const body = await req.json();
    const { id, reply, status } = body;

    if (!id) {
      return Response.json({ success: false, message: "Ticket ID required" }, { status: 400 });
    }

    const update = {};
    if (reply) update.adminReply = reply;
    if (status) update.status = status;

    if (Object.keys(update).length === 0) {
      return Response.json({ success: false, message: "No update data provided" }, { status: 400 });
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return Response.json({ success: true, message: "Ticket updated successfully" });
  } catch (error) {
    console.error("PATCH /support error:", error);
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
