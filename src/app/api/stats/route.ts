import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

interface BookingDoc {
  createdAt: Date;
  packageName: string;
}

interface Stats {
  totalBookings: number;
  totalUsers: number;
  totalPackages: number;
  bookings: { month: string; count: number }[];
  packages: { name: string; count: number }[];
}

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function GET(req: NextRequest) {
  try {
    // Await collections
    const bookingsCollection = await dbConnect("bookings");
    const usersCollection = await dbConnect("user");
    const packagesCollection = await dbConnect("tourPackages");

    // Total counts
    const totalBookings = await bookingsCollection.countDocuments();
    const totalUsers = await usersCollection.countDocuments();
    const totalPackages = await packagesCollection.countDocuments();

    // Monthly bookings aggregation
    const bookingsAgg = await bookingsCollection.aggregate([
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]).toArray();

    const bookings = bookingsAgg.map(b => ({
      month: months[b._id - 1],
      count: b.count
    }));

    // Package popularity aggregation
    const packagesAgg = await bookingsCollection.aggregate([
      { $group: { _id: "$packageName", count: { $sum: 1 } } }
    ]).toArray();

    const packages = packagesAgg.map(p => ({
      name: p._id,
      count: p.count
    }));

    const stats: Stats = { totalBookings, totalUsers, totalPackages, bookings, packages };

    return NextResponse.json(stats);
  } catch (err) {
    console.error("Failed to fetch stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
