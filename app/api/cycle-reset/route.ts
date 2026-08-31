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
   GET CURRENT CYCLE
========================================================= */

function getCurrentCycle() {
  const now = new Date();

  let currentCycle = CYCLES[0];

  for (const cycle of CYCLES) {
    if (now >= cycle.resetDate) {
      currentCycle = cycle;
    }
  }

  return currentCycle;
}

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    const now = new Date();

    /* =====================================================
       CURRENT CYCLE
    ===================================================== */

    const currentCycle = getCurrentCycle();

    console.log("=================================");
    console.log("CYCLE RESET CHECK");
    console.log("Current time:", now.toISOString());
    console.log("Current cycle:", currentCycle.cycle);
    console.log("Cycle name:", currentCycle.name);
    console.log(
      "Scheduled reset:",
      currentCycle.resetDate.toISOString()
    );
    console.log("=================================");

    /* =====================================================
       DATABASE
    ===================================================== */

    const db = await connectDB();

    const users = db.collection("users");

    const system = db.collection("system");

    /* =====================================================
       CHECK RESET MARKER
    ===================================================== */

    const resetKey =
      `cycle-reset-${currentCycle.cycle}`;

    const resetMarker =
      await system.findOne({
        key: resetKey,
      });

    /* =====================================================
       ALREADY RESET
    ===================================================== */

    if (resetMarker) {
      return NextResponse.json({
        success: true,

        reset: false,

        alreadyReset: true,

        cycle: currentCycle.cycle,

        cycleName: currentCycle.name,

        resetAt: resetMarker.resetAt,

        message:
          `${currentCycle.name} has already been reset.`,
      });
    }

    /* =====================================================
       RESET ALL USERS
    ===================================================== */

    const result =
      await users.updateMany(
        {},
        {
          $set: {
            /* =============================================
               GENIUS POINTS
            ============================================= */

            geniusPoints: 0,

            /* =============================================
               TITLE
            ============================================= */

            title: "🌱 Beginner",

            /* =============================================
               STREAK
            ============================================= */

            streak: 0,

            /* =============================================
               LAST SOLVED DATE
            ============================================= */

            lastSolvedDate: null,

            /* =============================================
               SOLVED FLAGS
            ============================================= */

            certificateSolved: false,

            satSolved: false,

            olympiadSolved: false,

            dailySolved: false,

            /* =============================================
               NATIONAL CERTIFICATE
            ============================================= */

            "stats.national.attempts": 0,

            "stats.national.correct": 0,

            /* =============================================
               SAT
            ============================================= */

            "stats.sat.attempts": 0,

            "stats.sat.correct": 0,

            /* =============================================
               OLYMPIAD
            ============================================= */

            "stats.olympiad.attempts": 0,

            "stats.olympiad.correct": 0,

            /* =============================================
               OLYMPIAD CYCLE DATA
            ============================================= */

            "stats.olympiad.genesis.attempts": 0,

            "stats.olympiad.genesis.correct": 0,

            "stats.olympiad.independence.attempts": 0,

            "stats.olympiad.independence.correct": 0,

            /* =============================================
               DAILY
            ============================================= */

            "stats.daily.attempts": 0,

            "stats.daily.correct": 0,

            /* =============================================
               MATH SPRINT
            ============================================= */

            "stats.mathSpirit.games": 0,

            "stats.mathSpirit.highestScore": 0,

            "stats.mathSpirit.totalScore": 0,

            "stats.mathSpirit.bestCombo": 0,

            /* =============================================
               CERTIFICATE CYCLES
            ============================================= */

            certificateCycles: {},

            /* =============================================
               CURRENT CYCLE
            ============================================= */

            currentCycle: currentCycle.cycle,

            currentCycleName: currentCycle.name,

            /* =============================================
               RESET DATE
            ============================================= */

            cycleResetAt: now,

            /* =============================================
               CYCLE START DATE
            ============================================= */

            cycleStartedAt:
              currentCycle.resetDate,
          },
        }
      );

    /* =====================================================
       RESET MATH SPRINT LEADERBOARD
    ===================================================== */

    const mathSpiritLeaderboard =
      db.collection(
        "math_spirit_leaderboard"
      );

    const mathSpiritResult =
      await mathSpiritLeaderboard.deleteMany(
        {}
      );

    /* =====================================================
       RESET CYCLE LEADERBOARD
    ===================================================== */

    const cycleLeaderboard =
      db.collection(
        "cycle_leaderboard"
      );

    const cycleLeaderboardResult =
      await cycleLeaderboard.deleteMany(
        {}
      );

    /* =====================================================
       GLOBAL LEADERBOARD
       DO NOT DELETE
    ===================================================== */

    /*
      Global leaderboard untouched.

      db.collection("leaderboard")
      NEVER deleted.
    */

    /* =====================================================
       SAVE RESET MARKER
    ===================================================== */

    await system.insertOne({
      key: resetKey,

      cycle: currentCycle.cycle,

      name: currentCycle.name,

      resetAt: now,

      scheduledResetAt:
        currentCycle.resetDate,

      usersReset:
        result.modifiedCount,

      mathSpiritLeaderboardDeleted:
        mathSpiritResult.deletedCount,

      cycleLeaderboardDeleted:
        cycleLeaderboardResult.deletedCount,
    });

    /* =====================================================
       LOG
    ===================================================== */

    console.log("=================================");
    console.log("CYCLE RESET SUCCESS");
    console.log("Cycle:", currentCycle.cycle);
    console.log("Name:", currentCycle.name);
    console.log(
      "Users reset:",
      result.modifiedCount
    );
    console.log(
      "Math Sprint deleted:",
      mathSpiritResult.deletedCount
    );
    console.log(
      "Cycle leaderboard deleted:",
      cycleLeaderboardResult.deletedCount
    );
    console.log(
      "Global leaderboard: NOT DELETED"
    );
    console.log("=================================");

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      success: true,

      reset: true,

      cycle: currentCycle.cycle,

      cycleName: currentCycle.name,

      usersReset:
        result.modifiedCount,

      mathSpiritLeaderboardDeleted:
        mathSpiritResult.deletedCount,

      cycleLeaderboardDeleted:
        cycleLeaderboardResult.deletedCount,

      globalLeaderboard:
        "NOT DELETED",

      resetAt: now,

      scheduledResetAt:
        currentCycle.resetDate,

      message:
        `${currentCycle.name} has started. All cycle progress has been reset successfully.`,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "CYCLE RESET ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
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