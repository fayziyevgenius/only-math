import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   CYCLE RESET DATES
========================================================= */

const CYCLES = [
  {
    cycle: 1,
    name: "Genesis Cycle",
    resetDate: new Date("2026-08-17T00:00:00+05:00"),
  },
  {
    cycle: 2,
    name: "Independence Cycle",
    resetDate: new Date("2026-08-31T00:00:00+05:00"),
  },
];

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    const now = new Date();

    /* =======================================================
       FIND LATEST CYCLE THAT SHOULD HAVE STARTED
    ======================================================= */

    let currentCycle = CYCLES[0];

    for (const cycle of CYCLES) {
      if (now >= cycle.resetDate) {
        currentCycle = cycle;
      }
    }

    /* =======================================================
       DATABASE
    ======================================================= */

    const db = await connectDB();

    const users = db.collection("users");

    /* =======================================================
       CHECK IF THIS CYCLE RESET WAS ALREADY COMPLETED
    ======================================================= */

    const resetMarker = await db
      .collection("system")
      .findOne({
        key: `cycle-reset-${currentCycle.cycle}`,
      });

    if (resetMarker) {
      return NextResponse.json({
        success: true,

        reset: false,

        alreadyReset: true,

        currentCycle: currentCycle.cycle,

        cycleName: currentCycle.name,

        message:
          `${currentCycle.name} reset has already been completed.`,
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

          currentCycle: currentCycle.cycle,

          /* -----------------------------------------------
             CYCLE RESET DATE
          ------------------------------------------------ */

          cycleResetAt: now,

          /* -----------------------------------------------
             CYCLE START DATE
          ------------------------------------------------ */

          cycleStartedAt: currentCycle.resetDate,
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

      Global Leaderboard remains untouched.
    */

    /* =======================================================
       SAVE RESET MARKER
    ======================================================= */

    await db.collection("system").insertOne({
      key: `cycle-reset-${currentCycle.cycle}`,

      cycle: currentCycle.cycle,

      name: currentCycle.name,

      resetAt: now,

      scheduledResetAt: currentCycle.resetDate,

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

      cycle: currentCycle.cycle,

      cycleName: currentCycle.name,

      usersReset: result.modifiedCount,

      mathSpiritLeaderboardDeleted:
        mathSpiritResult.deletedCount,

      cycleLeaderboardDeleted:
        cycleLeaderboardResult.deletedCount,

      globalLeaderboard:
        "NOT DELETED",

      message:
        `${currentCycle.name} has started. All user progress has been reset successfully.`,
    });
  } catch (error) {
    console.error(
      "CYCLE RESET ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Cycle reset failed.",
      },
      {
        status: 500,
      }
    );
  }
}