import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

interface BookingStats {
  month: string;
  count: number;
}

interface PackageStats {
  name: string;
  count: number;
}

interface Stats {
  totalBookings: number;
  totalUsers: number;
  totalPackages: number;
  bookings: BookingStats[];
  packages: PackageStats[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET(): Promise<NextResponse> {
  try {
    // Connect to collections
    const bookingsCollection = await dbConnect("bookings");
    const usersCollection = await dbConnect("user");
    const packagesCollection = await dbConnect("tourPackages");

    // Total counts
    const totalBookings = await bookingsCollection.countDocuments();
    const totalUsers = await usersCollection.countDocuments();
    const totalPackages = await packagesCollection.countDocuments();

    // Monthly bookings aggregation
    const bookingsAgg = await bookingsCollection
      .aggregate<{ _id: number; count: number }>([
        { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
      ])
      .toArray();

    const bookings: BookingStats[] = bookingsAgg.map((b) => ({
      month: months[b._id - 1],
      count: b.count,
    }));

    // Package popularity aggregation
    const packagesAgg = await bookingsCollection
      .aggregate<{ _id: string; count: number }>([
        { $group: { _id: "$packageName", count: { $sum: 1 } } },
      ])
      .toArray();

    const packages: PackageStats[] = packagesAgg.map((p) => ({
      name: p._id,
      count: p.count,
    }));

    const stats: Stats = {
      totalBookings,
      totalUsers,
      totalPackages,
      bookings,
      packages,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
