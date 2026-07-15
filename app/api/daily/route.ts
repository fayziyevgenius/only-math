import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { username, answer } = await req.json();

    const db = await connectDB();

    const user = await db.collection("users").findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // User bugungi Daily Challenge'ni ishlaganmi?
    if (user.lastDailyDate === today) {
      return NextResponse.json(
        {
          error: "You have already completed today's Daily Challenge.",
        },
        { status: 400 }
      );
    }

    let points = 0;

    // ===== Daily Question =====
    // <-- Bu yerni o'zingning javobingga almashtir
    if (answer.trim() === "2024") {
      points = 50;
    }

    const totalPoints = (user.geniusPoints || 0) + points;

    let title = "🌱 Beginner";

    if (totalPoints >= 100) title = "🥉 Bronze";
    if (totalPoints >= 300) title = "🥈 Silver";
    if (totalPoints >= 700) title = "🥇 Gold";
    if (totalPoints >= 1500) title = "💎 Diamond";
    if (totalPoints >= 3000) title = "👑 Math Genius";

    let update: any = {
      $set: {
        lastDailyDate: today,
        title,
      },
      $inc: {
        geniusPoints: points,
      },
    };

    // Streak kuniga faqat 1 marta oshadi
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
        points === 50
          ? "Perfect! Daily Challenge completed."
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