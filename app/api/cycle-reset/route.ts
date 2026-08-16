import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   GENESIS CYCLE START
========================================================= */

const RESET_DATE = new Date("2026-08-17T00:00:00+05:00");

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    const now = new Date();

    /* =======================================================
       BEFORE GENESIS START
    ======================================================= */

    if (now < RESET_DATE) {
      return NextResponse.json({
        success: true,
        reset: false,
        currentCycle: 1,
        cycleName: "Genesis Cycle",
        message:
          "Genesis Cycle reset is not available yet.",
      });
    }

    /* =======================================================
       DATABASE
    ======================================================= */

    const db = await connectDB();

    const users = db.collection("users");

    /* =======================================================
       CHECK IF GENESIS RESET WAS ALREADY COMPLETED
    ======================================================= */

    const resetMarker = await db
      .collection("system")
      .findOne({
        key: "cycle-reset-1",
      });

    if (resetMarker) {
      return NextResponse.json({
        success: true,
        reset: false,
        alreadyReset: true,
        currentCycle: 1,
        cycleName: "Genesis Cycle",
        message:
          "Genesis Cycle reset has already been completed.",
      });
    }

    /* =======================================================
       RESET ALL USERS
    ======================================================= */

    const result = await users.updateMany(
      {},
      {
        $set: {
          /* -----------------------------------------------
             GENIUS POINTS
          ------------------------------------------------ */

          geniusPoints: 0,

          /* -----------------------------------------------
             TITLE
          ------------------------------------------------ */

          title: "🌱 Beginner",

          /* -----------------------------------------------
             STREAK
          ------------------------------------------------ */

          streak: 0,

          /* -----------------------------------------------
             LAST SOLVED DATE
          ------------------------------------------------ */

          lastSolvedDate: null,

          /* -----------------------------------------------
             SOLVED FLAGS
          ------------------------------------------------ */

          certificateSolved: false,

          satSolved: false,

          olympiadSolved: false,

          dailySolved: false,

          /* -----------------------------------------------
             NATIONAL CERTIFICATE STATS
          ------------------------------------------------ */

          "stats.national.attempts": 0,
          "stats.national.correct": 0,

          /* -----------------------------------------------
             SAT STATS
          ------------------------------------------------ */

          "stats.sat.attempts": 0,
          "stats.sat.correct": 0,

          /* -----------------------------------------------
             OLYMPIAD STATS
          ------------------------------------------------ */

          "stats.olympiad.attempts": 0,
          "stats.olympiad.correct": 0,

          /* -----------------------------------------------
             DAILY STATS
          ------------------------------------------------ */

          "stats.daily.attempts": 0,
          "stats.daily.correct": 0,

          /* -----------------------------------------------
             MATH SPRINT STATS
          ------------------------------------------------ */

          "stats.mathSpirit.games": 0,
          "stats.mathSpirit.highestScore": 0,
          "stats.mathSpirit.totalScore": 0,
          "stats.mathSpirit.bestCombo": 0,

          /* -----------------------------------------------
             CURRENT CYCLE
          ------------------------------------------------ */

          currentCycle: 1,

          /* -----------------------------------------------
             CYCLE RESET DATE
          ------------------------------------------------ */

          cycleResetAt: now,

          /* -----------------------------------------------
             CYCLE START DATE
          ------------------------------------------------ */

          cycleStartedAt: RESET_DATE,
        },
      }
    );

    /* =======================================================
       RESET MATH SPRINT LEADERBOARD
    ======================================================= */

    const mathSpiritLeaderboard =
      db.collection("math_spirit_leaderboard");

    const mathSpiritResult =
      await mathSpiritLeaderboard.deleteMany({});

    /* =======================================================
       RESET CYCLE LEADERBOARD
    ======================================================= */

    const cycleLeaderboard =
      db.collection("cycle_leaderboard");

    const cycleLeaderboardResult =
      await cycleLeaderboard.deleteMany({});

    /* =======================================================
       IMPORTANT:
       GLOBAL LEADERBOARD IS NOT DELETED
    ======================================================= */

    /*
      We intentionally DO NOT delete:

        db.collection("leaderboard")

      So the Global Leaderboard collection remains untouched.
    */

    /* =======================================================
       SAVE RESET MARKER
    ======================================================= */

    await db.collection("system").insertOne({
      key: "cycle-reset-1",

      cycle: 1,

      name: "Genesis Cycle",

      resetAt: now,

      scheduledResetAt: RESET_DATE,

      usersReset: result.modifiedCount,

      mathSpiritLeaderboardDeleted:
        mathSpiritResult.deletedCount,

      cycleLeaderboardDeleted:
        cycleLeaderboardResult.deletedCount,
    });

    /* =======================================================
       RESPONSE
    ======================================================= */

    return NextResponse.json({
      success: true,

      reset: true,

      cycle: 1,

      cycleName: "Genesis Cycle",

      usersReset: result.modifiedCount,

      mathSpiritLeaderboardDeleted:
        mathSpiritResult.deletedCount,

      cycleLeaderboardDeleted:
        cycleLeaderboardResult.deletedCount,

      globalLeaderboard:
        "NOT DELETED",

      message:
        "Genesis Cycle has started. All user progress has been reset successfully.",
    });
  } catch (error) {
    console.error(
      "GENESIS CYCLE RESET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Genesis Cycle reset failed.",
      },
      {
        status: 500,
      }
    );
  }
}