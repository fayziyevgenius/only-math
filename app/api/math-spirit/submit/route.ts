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

    const db = await connectDB();

    const leaderboard = db.collection("math_spirit_leaderboard");
    const users = db.collection("users");

    const user = await users.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // =========================================
    // GP
    // =========================================

    const gp = Math.floor(score / 5);

    // =========================================
    // OLD RANK
    // =========================================

    const oldRank = user.title || "🌱 Beginner";

    // =========================================
    // LEADERBOARD
    // =========================================

    const existing = await leaderboard.findOne({
      username,
    });

    let earnedGP = gp;

    // =========================================
    // FIRST GAME
    // =========================================

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
            "stats.mathSpirit.games": 1,
            "stats.mathSpirit.totalScore": score,
          },

          $max: {
            "stats.mathSpirit.highestScore": score,
            "stats.mathSpirit.bestCombo": bestCombo,
          },
        }
      );
    }

    // =========================================
    // NEW PERSONAL BEST
    // =========================================

    else if (score > existing.score) {
      earnedGP = gp + 10;

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

      await users.updateOne(
        { username },
        {
          $inc: {
            geniusPoints: earnedGP,
            "stats.mathSpirit.games": 1,
            "stats.mathSpirit.totalScore": score,
          },

          $max: {
            "stats.mathSpirit.highestScore": score,
            "stats.mathSpirit.bestCombo": bestCombo,
          },
        }
      );
    }

    // =========================================
    // NORMAL GAME
    // =========================================

    else {
      await users.updateOne(
        { username },
        {
          $inc: {
            geniusPoints: gp,
            "stats.mathSpirit.games": 1,
            "stats.mathSpirit.totalScore": score,
          },

          $max: {
            "stats.mathSpirit.bestCombo": bestCombo,
          },
        }
      );
    }

    // =========================================
    // NEW TOTAL GP
    // =========================================

    const newTotalPoints =
      (user.geniusPoints || 0) + earnedGP;

    // =========================================
    // NEW RANK
    // =========================================

    let newRank = "🌱 Beginner";

    if (newTotalPoints >= 100) {
      newRank = "🥉 Bronze";
    }

    if (newTotalPoints >= 300) {
      newRank = "🥈 Silver";
    }

    if (newTotalPoints >= 700) {
      newRank = "🥇 Gold";
    }

    if (newTotalPoints >= 1500) {
      newRank = "💎 Diamond";
    }

    if (newTotalPoints >= 3000) {
      newRank = "👑 Math Genius";
    }

    // =========================================
    // RANK UP
    // =========================================

    const rankUp = oldRank !== newRank;

    // =========================================
    // ACHIEVEMENTS
    // =========================================

    const unlockedAchievements: string[] = [];

    // -----------------------------------------
    // MATH SPRINT 60+
    // -----------------------------------------

    const currentHighestScore = Math.max(
      user.stats?.mathSpirit?.highestScore || 0,
      score
    );

    if (currentHighestScore >= 60) {
      unlockedAchievements.push(
        "math-sprint-60"
      );
    }

    // -----------------------------------------
    // UPDATE USER
    // -----------------------------------------

    const updateOperation: any = {
      $set: {
        title: newRank,
      },
    };

    if (unlockedAchievements.length > 0) {
      updateOperation.$addToSet = {
        achievements: {
          $each: unlockedAchievements,
        },
      };
    }

    await users.updateOne(
      { username },
      updateOperation
    );

    // =========================================
    // RESPONSE
    // =========================================

    return NextResponse.json({
      success: true,

      gpEarned: earnedGP,

      totalPoints: newTotalPoints,

      // Rank
      rankUp,
      oldRank,
      newRank,

      // Achievement
      achievementsUnlocked:
        unlockedAchievements,

      mathSprint60:
        currentHighestScore >= 60,
    });
  } catch (error) {
    console.error(
      "Math Sprint API error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}