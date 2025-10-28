"use server";

import {
  MongoClient,
  ServerApiVersion,
  Db,
  Collection,
  Document,
} from "mongodb";

// Keep client in memory to avoid reconnecting on each request (important for Next.js hot reload)
let client: MongoClient | null = null;
let database: Db | null = null;

/**
 * Connect to MongoDB and return a specific collection.
 * Automatically reuses existing connection for performance.
 */
export async function dbConnect<T extends Document>(
  collectionName: string
): Promise<Collection<T>> {
  if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
    throw new Error("❌ Missing environment variable: NEXT_PUBLIC_MONGODB_URI");
  }

  if (!process.env.DB_NAME) {
    throw new Error("❌ Missing environment variable: DB_NAME");
  }

  // Reuse existing connection if available
  if (!client) {
    client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 10,
    });

    await client.connect();
    database = client.db(process.env.DB_NAME);

    console.log("✅ MongoDB connected successfully");
  }

  // Return requested collection
  return database!.collection<T>(collectionName);
}
