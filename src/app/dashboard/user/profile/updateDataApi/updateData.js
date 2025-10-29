"use server";

import dbConnect from "@/lib/dbConnect";
import { revalidatePath } from "next/cache";

const updateData = async (data) => {
    const {name,image, email} = data;
    const filter = {email};
    const updateDoc = {
        $set: {name,image}
    }
    
    const result = await dbConnect("user").updateOne(filter,updateDoc);
    revalidatePath("/dashboard/user/profile");
    return JSON.stringify(result);
};

export default updateData;