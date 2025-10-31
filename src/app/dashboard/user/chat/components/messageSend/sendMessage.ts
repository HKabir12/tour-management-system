"use server";

import { Collection, Document } from "mongodb";
import dbConnect from "@/lib/dbConnect";

// Define the message type
interface Message {
  id: number | string;
  name: string;
  senderEmail: string;
  tourName: string;
  text: string;
  date: string;
}

const sendMessage = async (data: Message) => {
  // Connect to the messages collection
  const messagesCollection: Collection<Document> = await dbConnect("messages");

  // Insert the message
  const result = await messagesCollection.insertOne(data);

  // ✅ Return a plain object (no ObjectId)
  return {
    acknowledged: result.acknowledged,
    insertedId: result.insertedId.toString(), // Convert ObjectId → string
    message: data, // optional: send back original message
  };
};

export default sendMessage;
