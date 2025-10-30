// src/app/api/tours/budget/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const budgetParam = searchParams.get("budget");
    if (!budgetParam) {
      return NextResponse.json({ message: "Budget required" }, { status: 400 });
    }

    const budget = parseFloat(budgetParam);
    if (isNaN(budget) || budget <= 0) {
      return NextResponse.json({ message: "Invalid budget" }, { status: 400 });
    }

    const collection = await dbConnect("tours");

    // Get tours with costFrom within ±20% of user budget
    const lowerBound = budget * 0.8;
    const upperBound = budget * 1.2;

    const tours = await collection
      .find({ costFrom: { $gte: lowerBound, $lte: upperBound } })
      .toArray();

    return NextResponse.json(tours, { status: 200 });
  } catch (err: unknown) {
    console.error("Error fetching tours by budget:", err);
    let message = "Server error";
    if (err instanceof Error) message = err.message;
    return NextResponse.json({ message }, { status: 500 });
  }
}
