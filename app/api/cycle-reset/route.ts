import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   CYCLE CONFIGURATION
========================================================= */

const CYCLES = [
  {
    cycle: 1,
    name: "Genesis Cycle",
    startDate: new Date("2026-08-17T00:00:00+05:00"),
  },
  {
    cycle: 2,
    name: "Independence Cycle",
    startDate: new Date("2026-08-31T00:00:00+05:00"),
  },
];

/* =========================================================
   GET CURRENT CYCLE
========================================================= */

function getCurrentCycle(now: Date) {
  let current = null;

  for (const cycle of CYCLES) {
    if (now >= cycle.startDate) {
      current = cycle;
    }
  }

  return current;
}

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    const now = new Date();

    /* =======================================================
       FIND CURRENT CYCLE
    ======================================================= */

    const currentCycle = getCurrentCycle(now);

    /* =======================================================
       BEFORE FIRST CYCLE
    ======================================================= */

    if (!currentCycle) {
      return NextResponse.json({
        success: true,
        reset: false,
        message: "No cycle has started yet.",
      });
    }

    /* =======================================================
       DATABASE
    ======================================================= */

    const db = await connectDB();

    const users = db.collection("users");

    const system = db.collection("system");

    /* =======================================================
       RESET MARKER
    ======================================================= */

    const resetKey = `cycle-reset-${currentCycle.cycle}`;

    /* =======================================================
       CHECK IF THIS CYCLE WAS ALREADY RESET
    ======================================================= */

    const resetMarker = await system.findOne({
      key: resetKey,
    });

    if (resetMarker) {
      return NextResponse.json({
        success: true,

        reset: false,

        alreadyReset: true,

        cycle: currentCycle.cycle,

        cycleName: currentCycle.name,

        resetAt: resetMarker.resetAt,

        message: `${currentCycle.name} has already been reset.`,
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

          cycleStartedAt: currentCycle.startDate,
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
      DO NOT DELETE:

        db.collection("leaderboard")

      Global Leaderboard remains untouched.
    */

    /* =======================================================
       SAVE RESET MARKER
    ======================================================= */

    await system.insertOne({
      key: resetKey,

      cycle: currentCycle.cycle,

      name: currentCycle.name,

      resetAt: now,

      scheduledResetAt: currentCycle.startDate,

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
        `${currentCycle.name} has started. All cycle progress has been reset successfully.`,
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