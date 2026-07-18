import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    const leaderboard = await db
      .collection("math_spirit_leaderboard")
      .find({})
      .sort({ score: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}