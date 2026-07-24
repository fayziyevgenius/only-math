import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    const users = db.collection("users");

    const result = await users.updateMany(
      {},
      {
        $set: {
          "stats.national": {
            attempts: 0,
            correct: 0,
          },
          "stats.sat": {
            attempts: 0,
            correct: 0,
          },
          "stats.olympiad": {
            attempts: 0,
            correct: 0,
          },
          "stats.daily": {
            attempts: 0,
            correct: 0,
          },
        },
        $setOnInsert: {},
        $max: {
          "stats.mathSpirit.highestScore": 0,
        },
      }
    );

    return NextResponse.json({
      success: true,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}