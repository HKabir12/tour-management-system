"use server";

import { Collection, Document, InsertOneResult } from "mongodb";
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

const sendMessage = async (data: Message): Promise<InsertOneResult<Document>> => {
  // Await the collection first
  const messagesCollection: Collection<Document> = await dbConnect("messages");

  // Insert the message
  const result = await messagesCollection.insertOne(data);

  return result;
};

export default sendMessage;
