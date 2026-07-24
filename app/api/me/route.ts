import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getTitle } from "@/lib/title";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    const db = await connectDB();

    const user = await db.collection("users").findOne(
      { username },
      {
        projection: {
          password: 0,
        },
      }
    );
    console.log(user);

    if (!user) {
    
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    const stats = {
  national: {
    attempts: user.stats?.national?.attempts ?? 0,
    correct: user.stats?.national?.correct ?? 0,
  },
  sat: {
    attempts: user.stats?.sat?.attempts ?? 0,
    correct: user.stats?.sat?.correct ?? 0,
  },
  olympiad: {
    attempts: user.stats?.olympiad?.attempts ?? 0,
    correct: user.stats?.olympiad?.correct ?? 0,
  },
  daily: {
    attempts: user.stats?.daily?.attempts ?? 0,
    correct: user.stats?.daily?.correct ?? 0,
  },
  mathSpirit: {
    games: user.stats?.mathSpirit?.games ?? 0,
    highestScore: user.stats?.mathSpirit?.highestScore ?? 0,
    totalScore: user.stats?.mathSpirit?.totalScore ?? 0,
    bestCombo: user.stats?.mathSpirit?.bestCombo ?? 0,
  },
};
    return NextResponse.json({
  ...user,
  title: getTitle(user.geniusPoints || 0),
  stats,
});

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}