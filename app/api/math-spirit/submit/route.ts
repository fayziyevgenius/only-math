import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const {
      username,
      score,
      correct,
      wrong,
      bestCombo,
    } = await req.json();

    const gp = Math.floor(score / 5);

    const db = await connectDB();

    const leaderboard = db.collection("math_spirit_leaderboard");
    const users = db.collection("users");

    const existing = await leaderboard.findOne({ username });

    if (!existing) {
      await leaderboard.insertOne({
        username,
        score,
        correct,
        wrong,
        bestCombo,
        createdAt: new Date(),
      });

      await users.updateOne(
        { username },
        {
          $inc: {
            geniusPoints: gp,
          },
        }
      );
    } else if (score > existing.score) {
      await leaderboard.updateOne(
        { username },
        {
          $set: {
            score,
            correct,
            wrong,
            bestCombo,
            updatedAt: new Date(),
          },
        }
      );

      // Personal Best bonus
      await users.updateOne(
        { username },
        {
          $inc: {
            geniusPoints: gp + 10,
          },
        }
      );
    } else {
      // Oddiy o'yin (rekord yangilanmadi)
      await users.updateOne(
        { username },
        {
          $inc: {
            geniusPoints: gp,
          },
        }
      );
    }

    return NextResponse.json({
      success: true,
      gpEarned: !existing
        ? gp
        : score > existing.score
        ? gp + 10
        : gp,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}