"use server";

import { Collection, MongoClient, ServerApiVersion } from "mongodb";

let client: MongoClient | null = null;

async function dbConnect(collectionName: string): Promise<Collection> {
  const uri = process.env.MONGODB_URL;
  const dbName = process.env.DB_NAME;

  if (!uri || !dbName) {
    throw new Error("Missing MongoDB connection details in environment variables");
  }

  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
    });
    await client.connect();
  }

  return client.db(dbName).collection(collectionName);
}

export default dbConnect;
