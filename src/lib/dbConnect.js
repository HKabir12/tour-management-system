'use server'
import { MongoClient, ServerApiVersion } from "mongodb";
// database connection start here abul kalam ***********************
// import React from 'react';

function dbConnect(collectionName) {

   

    const uri = process.env.NEXT_PUBLIC_MONGODB_URI;
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
            maxPoolSize: 10,
        },
    });
    return client.db(process.env.DB_NAME).collection(collectionName)
}
export default dbConnect;