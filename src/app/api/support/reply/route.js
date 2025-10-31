// import dbConnect from "@/lib/dbConnect";
// import { ObjectId } from "mongodb";

// export async function POST(req) {
//   try {
//     const client = await dbConnect();
//     const db = client.db("tour_managment_system");
//     const collection = db.collection("supportTickets");

//     const body = await req.json();
//     const { ticketId, adminReply, status } = body;

//     await collection.updateOne(
//       { _id: new ObjectId(ticketId) },
//       { $set: { adminReply, status: status || "Closed" } }
//     );

//     return Response.json({ success: true, message: "Reply added successfully" });
//   } catch (error) {
//     return Response.json({ success: false, message: error.message });
//   }
// }

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { db } = await dbConnect();
    const collection = db.collection("supportTickets");

    const body = await req.json();
    const { ticketId, adminReply, status } = body;

    await collection.updateOne(
      { _id: new ObjectId(ticketId) },
      { $set: { adminReply, status: status || "Closed" } }
    );

    return Response.json({ success: true, message: "Reply added successfully" });
  } catch (error) {
    return Response.json({ success: false, message: error.message });
  }
}

