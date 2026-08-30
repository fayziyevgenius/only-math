import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   CYCLE SETTINGS
========================================================= */

const FIRST_CYCLE_DATE = new Date(
  "2026-08-17T00:00:00+05:00"
);

const CYCLE_LENGTH_DAYS = 14;

/* =========================================================
   GET CURRENT CYCLE
========================================================= */

function getCurrentCycle(now: Date) {
  if (now < FIRST_CYCLE_DATE) {
    return null;
  }

  const diff =
    now.getTime() - FIRST_CYCLE_DATE.getTime();

  const daysPassed =
    Math.floor(
      diff / (1000 * 60 * 60 * 24)
    );

  const cycle =
    Math.floor(
      daysPassed / CYCLE_LENGTH_DAYS
    ) + 1;

  const cycleStart =
    new Date(FIRST_CYCLE_DATE);

  cycleStart.setDate(
    cycleStart.getDate() +
      (cycle - 1) * CYCLE_LENGTH_DAYS
  );

  let cycleName = `Cycle ${cycle}`;

  if (cycle === 1) {
    cycleName = "Genesis Cycle";
  }

  if (cycle === 2) {
    cycleName = "Independence Cycle";
  }

  return {
    cycle,
    cycleName,
    cycleStart,
  };
}

/* =========================================================
   RESET
========================================================= */

async function resetCycle() {
  const now = new Date();

  /* =======================================================
     GET CURRENT CYCLE
  ======================================================= */

  const currentCycle =
    getCurrentCycle(now);

  if (!currentCycle) {
    return NextResponse.json({
      success: true,
      reset: false,
      message:
        "The first cycle has not started yet.",
    });
  }

  /* =======================================================
     DATABASE
  ======================================================= */

  const db = await connectDB();

  const users =
    db.collection("users");

  const system =
    db.collection("system");

  /* =======================================================
     RESET MARKER
  ======================================================= */

  const resetKey =
    `cycle-reset-${currentCycle.cycle}`;

  /* =======================================================
     CHECK IF ALREADY RESET
  ======================================================= */

  const alreadyReset =
    await system.findOne({
      key: resetKey,
    });

  if (alreadyReset) {
    return NextResponse.json({
      success: true,
      reset: false,
      alreadyReset: true,
      cycle: currentCycle.cycle,
      cycleName: currentCycle.cycleName,
      message:
        `${currentCycle.cycleName} has already been reset.`,
    });
  }

  /* =======================================================
     RESET USERS
  ======================================================= */

  const userResult =
    await users.updateMany(
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
             NATIONAL CERTIFICATE
          ------------------------------------------------ */

          "stats.national.attempts": 0,
          "stats.national.correct": 0,

          /* -----------------------------------------------
             SAT
          ------------------------------------------------ */

          "stats.sat.attempts": 0,
          "stats.sat.correct": 0,

          /* -----------------------------------------------
             OLYMPIAD
          ------------------------------------------------ */

          "stats.olympiad.attempts": 0,
          "stats.olympiad.correct": 0,

          /* -----------------------------------------------
             DAILY
          ------------------------------------------------ */

          "stats.daily.attempts": 0,
          "stats.daily.correct": 0,

          /* -----------------------------------------------
             MATH SPIRIT
          ------------------------------------------------ */

          "stats.mathSpirit.games": 0,
          "stats.mathSpirit.highestScore": 0,
          "stats.mathSpirit.totalScore": 0,
          "stats.mathSpirit.bestCombo": 0,

          /* -----------------------------------------------
             CURRENT CYCLE
          ------------------------------------------------ */

          currentCycle:
            currentCycle.cycle,

          /* -----------------------------------------------
             CYCLE START
          ------------------------------------------------ */

          cycleStartedAt:
            currentCycle.cycleStart,

          /* -----------------------------------------------
             RESET TIME
          ------------------------------------------------ */

          cycleResetAt: now,
        },
      }
    );

  /* =======================================================
     RESET MATH SPIRIT LEADERBOARD
  ======================================================= */

  const mathSpiritLeaderboard =
    db.collection(
      "math_spirit_leaderboard"
    );

  const mathSpiritResult =
    await mathSpiritLeaderboard.deleteMany(
      {}
    );

  /* =======================================================
     RESET CYCLE LEADERBOARD
  ======================================================= */

  const cycleLeaderboard =
    db.collection(
      "cycle_leaderboard"
    );

  const cycleLeaderboardResult =
    await cycleLeaderboard.deleteMany(
      {}
    );

  /* =======================================================
     IMPORTANT
     GLOBAL LEADERBOARD IS NOT TOUCHED
  ======================================================= */

  /*
     DO NOT DELETE:

     db.collection("leaderboard")

     Global leaderboard remains untouched.
  */

  /* =======================================================
     SAVE RESET MARKER
  ======================================================= */

  await system.insertOne({
    key: resetKey,

    cycle:
      currentCycle.cycle,

    name:
      currentCycle.cycleName,

    resetAt: now,

    scheduledResetAt:
      currentCycle.cycleStart,

    usersReset:
      userResult.modifiedCount,

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

    cycle:
      currentCycle.cycle,

    cycleName:
      currentCycle.cycleName,

    cycleStartedAt:
      currentCycle.cycleStart,

    usersReset:
      userResult.modifiedCount,

    mathSpiritLeaderboardDeleted:
      mathSpiritResult.deletedCount,

    cycleLeaderboardDeleted:
      cycleLeaderboardResult.deletedCount,

    globalLeaderboard:
      "NOT DELETED",

    message:
      `${currentCycle.cycleName} has started successfully.`,
  });
}

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    return await resetCycle();
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

/* =========================================================
   GET
   Useful for browser testing
========================================================= */

export async function GET() {
  try {
    return await resetCycle();
  } catch (error) {
    console.error(
      "CYCLE RESET GET ERROR:",
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