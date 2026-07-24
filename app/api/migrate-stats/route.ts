import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await connectDB();

    const result = await db.collection("users").updateMany(
      {
        stats: { $exists: false },
      },
      {
        $set: {
          stats: {
            national: {
              attempts: 0,
              correct: 0,
            },
            sat: {
              attempts: 0,
              correct: 0,
            },
            olympiad: {
              attempts: 0,
              correct: 0,
            },
            daily: {
              attempts: 0,
              correct: 0,
            },
            mathSpirit: {
              games: 0,
              highestScore: 0,
              totalScore: 0,
              bestCombo: 0,
            },
          },
        },
      }
    );

    return NextResponse.json({
      success: true,
      updatedUsers: result.modifiedCount,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}