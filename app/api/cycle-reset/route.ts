import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

const RESET_DATE = new Date("2026-08-17T00:00:00+05:00");

export async function POST() {
  try {
    const now = new Date();

    // ============================================
    // 17-AUGUST 00:00 DAN OLDIN RESET QILINMAYDI
    // ============================================

    if (now < RESET_DATE) {
      return NextResponse.json({
        success: true,
        reset: false,
        message: "Cycle reset is not available yet.",
      });
    }

    const db = await connectDB();

    const users = db.collection("users");

    // ============================================
    // CHECK WHETHER RESET WAS ALREADY DONE
    // ============================================

    const resetMarker = await db
      .collection("system")
      .findOne({
        key: "cycle-reset-2",
      });

    if (resetMarker) {
      return NextResponse.json({
        success: true,
        reset: false,
        alreadyReset: true,
        message: "Cycle 2 reset has already been completed.",
      });
    }

    // ============================================
    // RESET ALL USERS
    // ============================================

    const result = await users.updateMany(
      {},
      {
        $set: {
          // ----------------------------------------
          // GENIUS POINTS
          // ----------------------------------------

          geniusPoints: 0,

          // ----------------------------------------
          // RANK
          // ----------------------------------------

          title: "🌱 Beginner",

          // ----------------------------------------
          // STREAK
          // ----------------------------------------

          streak: 0,

          // ----------------------------------------
          // DAILY
          // ----------------------------------------

          dailySolved: false,

          "stats.daily.attempts": 0,
          "stats.daily.correct": 0,

          // ----------------------------------------
          // NATIONAL CERTIFICATE
          // ----------------------------------------

          "stats.national.attempts": 0,
          "stats.national.correct": 0,

          // ----------------------------------------
          // SAT
          // ----------------------------------------

          "stats.sat.attempts": 0,
          "stats.sat.correct": 0,

          // ----------------------------------------
          // OLYMPIAD
          // ----------------------------------------

          "stats.olympiad.attempts": 0,
          "stats.olympiad.correct": 0,

          // ----------------------------------------
          // MATH SPRINT
          // ----------------------------------------

          "stats.mathSpirit.games": 0,
          "stats.mathSpirit.highestScore": 0,
          "stats.mathSpirit.totalScore": 0,
          "stats.mathSpirit.bestCombo": 0,

          // ----------------------------------------
          // CYCLE INFO
          // ----------------------------------------

          currentCycle: 2,

          cycleResetAt: now,

          cycleStartedAt: RESET_DATE,
        },
      }
    );

    // ============================================
    // RESET MATH SPRINT LEADERBOARD
    // ============================================

    const mathSpiritLeaderboard =
      db.collection("math_spirit_leaderboard");

    await mathSpiritLeaderboard.deleteMany({});

    // ============================================
    // RESET GLOBAL LEADERBOARD IF EXISTS
    // ============================================

    const leaderboard =
      db.collection("leaderboard");

    await leaderboard.deleteMany({});

    // ============================================
    // RESET CYCLE LEADERBOARD IF EXISTS
    // ============================================

    const cycleLeaderboard =
      db.collection("cycle_leaderboard");

    await cycleLeaderboard.deleteMany({});

    // ============================================
    // SAVE RESET MARKER
    // ============================================

    await db.collection("system").insertOne({
      key: "cycle-reset-2",
      cycle: 2,
      name: "Independence Cycle",
      resetAt: now,
      scheduledResetAt: RESET_DATE,
      usersReset: result.modifiedCount,
    });

    // ============================================
    // RESPONSE
    // ============================================

    return NextResponse.json({
      success: true,
      reset: true,

      cycle: 2,
      cycleName: "Independence Cycle",

      usersReset: result.modifiedCount,

      message:
        "All Cycle 1 progress has been reset successfully.",
    });
  } catch (error) {
    console.error("CYCLE RESET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Cycle reset failed.",
      },
      {
        status: 500,
      }
    );
  }
}