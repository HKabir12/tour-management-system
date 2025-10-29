"use server";

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

const paidBooking = async (email) => {
    const filter ={
        email,
        paymentStatus: "paid"
    }

    const result = await dbConnect("bookings").find(filter).toArray();
    let newResult = [];
    for (const single of result) {
        const {_id:id, tourId, tourName} = single;
        const tourResult = await dbConnect("tourPackages").findOne({_id: new ObjectId(tourId)});
    
        newResult.push({id, tourName ,image: tourResult?.image});
    }

    return JSON.stringify(newResult);
};

export default paidBooking;