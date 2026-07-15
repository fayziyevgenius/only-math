import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { username, answer1, answer2 } = await req.json();

const db = await connectDB();

const user = await db.collection("users").findOne({ username });
if (!user) {
  return NextResponse.json(
    {
      username,
      error: "User not found",
    },
    { status: 404 }
  );
}

    if (user.certificateSolved) {
      return NextResponse.json(
        { error: "You have already completed this Certificate test." },
        { status: 400 }
      );
    }

    let points = 0;

    // Question 1
    if (answer1.trim() === "3") {
      points += 30;
    }

    // Question 2
    if (answer2.trim() === "60") {
      points += 40;
    }

    const totalPoints = (user.geniusPoints || 0) + points;

let title = "🌱 Beginner";

if (totalPoints >= 100) title = "🥉 Bronze";
if (totalPoints >= 300) title = "🥈 Silver";
if (totalPoints >= 700) title = "🥇 Gold";
if (totalPoints >= 1500) title = "💎 Diamond";
if (totalPoints >= 3000) title = "👑 Math Genius";

const today = new Date().toISOString().split("T")[0];

let update: any = {
  $set: {
    certificateSolved: true,
  },
  $inc: {
    geniusPoints: points,
  },
};

if (user.lastSolvedDate !== today) {
  update.$inc.streak = 1;
  update.$set.lastSolvedDate = today;
}

await db.collection("users").updateOne(
  { username },
  update
);

    return NextResponse.json({
      success: true,
      points,
      message:
        points === 70
          ? "Perfect! You solved all questions correctly."
          : `You received ${points} GP.`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}