"use server";

import { Collection, Document, WithId } from "mongodb";
import dbConnect from "@/lib/dbConnect";

// Define the message type
export interface Message {
  id: number | string;
  name: string;
  senderEmail: string;
  tourName: string;
  text: string;
  date: string;
}

const messageGet = async (data: { tourName: string }): Promise<Message[]> => {
  // Await the collection first
  const messagesCollection: Collection<Document> = await dbConnect("messages");

  // Fetch raw messages
  const rawMessages: WithId<Document>[] = await messagesCollection.find(data).toArray();

  // Map to Message type
  const messages: Message[] = rawMessages.map((msg) => ({
    id: msg._id.toString(), // convert ObjectId to string
    name: msg.name as string,
    senderEmail: msg.senderEmail as string,
    tourName: msg.tourName as string,
    text: msg.text as string,
    date: msg.date as string,
  }));

  return messages;
};

export default messageGet;
