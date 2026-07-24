import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getTitle } from "@/lib/title";
export async function GET() {
  try {
    const db = await connectDB();

    const users = await db
      .collection("users")
      .find(
        {},
        {
          projection: {
            password: 0,
          },
        }
      )
      .sort({ geniusPoints: -1 })
      .limit(100)
      .toArray();
    const leaderboard = users.map((user) => ({
  ...user,
  title: getTitle(user.geniusPoints || 0),
}));
    return NextResponse.json(leaderboard);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}