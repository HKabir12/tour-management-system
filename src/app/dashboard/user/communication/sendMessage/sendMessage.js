"use server";

import dbConnect from "@/lib/dbConnect";

const sendMessage = async (data) => {

    const result = await dbConnect("messages").insertOne(data);

    return JSON.stringify(result);
};

export default sendMessage;