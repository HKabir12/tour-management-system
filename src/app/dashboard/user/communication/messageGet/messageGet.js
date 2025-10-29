"use server";

import dbConnect from "@/lib/dbConnect";

const messageGet = async (data) => {
    const result = await dbConnect("messages").find(data).toArray();

    return JSON.stringify(result);
};

export default messageGet;