import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   CYCLE CONFIGURATION
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
    now.getTime() -
    FIRST_CYCLE_DATE.getTime();

  const daysPassed = Math.floor(
    diff / (1000 * 60 * 60 * 24)
  );

  const cycle =
    Math.floor(
      daysPassed / CYCLE_LENGTH_DAYS
    ) + 1;

  const cycleStart = new Date(
    FIRST_CYCLE_DATE
  );

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
   MAIN RESET FUNCTION
========================================================= */

async function performReset() {
  const now = new Date();

  /* =======================================================
     CURRENT CYCLE
  ======================================================= */

  const currentCycle =
    getCurrentCycle(now);

  if (!currentCycle) {
    return NextResponse.json({
      success: true,
      reset: false,
      message:
        "No cycle has started yet.",
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
     
     IMPORTANT:
     Each cycle can be reset ONLY ONCE.
     
     After the reset:
     
     User gets GP
     User completes tasks
     User's GP changes
     
     BUT the marker remains.
     
     Therefore the cycle will NEVER be reset again.
  ======================================================= */

  const resetKey =
    `cycle-reset-${currentCycle.cycle}`;

  const existingMarker =
    await system.findOne({
      key: resetKey,
    });

  /* =======================================================
     ALREADY RESET
     
     DO NOT CHECK USER VALUES HERE.
     
     This is the most important fix.
     
     We do NOT care if:
     
     geniusPoints = 0
     geniusPoints = 20
     geniusPoints = 100
     currentCycleGP = 50
     
     If the marker exists, reset is finished.
  ======================================================= */

  if (existingMarker) {
    return NextResponse.json({
      success: true,

      reset: false,

      alreadyReset: true,

      cycle:
        currentCycle.cycle,

      cycleName:
        currentCycle.cycleName,

      resetAt:
        existingMarker.resetAt,

      message:
        `${currentCycle.cycleName} has already been reset. User scores will NOT be reset again.`,
    });
  }

  /* =======================================================
     FIRST RESET FOR THIS CYCLE
  ======================================================= */

  console.log(
    `Starting first reset for ${currentCycle.cycleName}`
  );

  /* =======================================================
     RESET ALL USERS
     
     IMPORTANT:
     This happens ONLY ONCE because of reset marker above.
  ======================================================= */

  const userResult =
    await users.updateMany(
      {},
      {
        $set: {
          /* -----------------------------------------------
             GLOBAL / CURRENT GP
             
             Reset at beginning of a new cycle.
          ------------------------------------------------ */

          geniusPoints: 0,

          /* -----------------------------------------------
             CURRENT CYCLE SCORE
          ------------------------------------------------ */

          currentCycleGP: 0,

          /* -----------------------------------------------
             TITLE
          ------------------------------------------------ */

          title: "🌱 Beginner",

          /* -----------------------------------------------
             STREAK
          ------------------------------------------------ */

          streak: 0,

          /* -----------------------------------------------
             DATES
          ------------------------------------------------ */

          lastSolvedDate: null,

          lastDailyDate: null,

          /* -----------------------------------------------
             CURRENT CYCLE
          ------------------------------------------------ */

          currentCycle:
            currentCycle.cycle,

          cycleResetAt: now,

          cycleStartedAt:
            currentCycle.cycleStart,

          /* -----------------------------------------------
             SOLVED FLAGS
          ------------------------------------------------ */

          certificateSolved: false,

          satSolved: false,

          olympiadSolved: false,

          dailySolved: false,

          /* -----------------------------------------------
             DAILY CYCLE
          ------------------------------------------------ */

          lastDailyCycle:
            currentCycle.cycleName,

          lastDailyCycleDay: 0,

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
             MATH SPRINT
          ------------------------------------------------ */

          "stats.mathSpirit.games": 0,

          "stats.mathSpirit.highestScore": 0,

          "stats.mathSpirit.totalScore": 0,

          "stats.mathSpirit.bestCombo": 0,

          /* -----------------------------------------------
             OLD CYCLE FLAGS
          ------------------------------------------------ */

          olympiadGenesisSolved: false,

          satGenesisSolved: false,

          lastSATCycle: null,

          /* -----------------------------------------------
             GUESS PASSWORD / HACKER
          ------------------------------------------------ */

          guessPasswordUnlocked: false,

          guessPasswordRewardClaimed: false,
        },

        /* =================================================
           REMOVE OLD CYCLE DATA
        ================================================= */

        $unset: {
          "stats.genesis": "",

          "stats.sat.genesis": "",

          "stats.olympiad.genesis": "",

          "certificateCycles.genesis": "",

          "trainingAttempts.genesis": "",

          "trainingAttempts.1": "",

          "trainingAttempts.2": "",

          "trainingAttempts.3": "",

          guessPasswordRewardAt: "",
        },
      }
    );

  /* =======================================================
     RESET MATH SPRINT LEADERBOARD
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
     GLOBAL LEADERBOARD
     
     NOTE:
     This is kept according to your existing system.
  ======================================================= */

  const globalLeaderboard =
    db.collection("leaderboard");

  const globalLeaderboardResult =
    await globalLeaderboard.deleteMany(
      {}
    );

  /* =======================================================
     SAVE RESET MARKER
     
     This MUST happen after the reset.
     
     Once this exists, future requests will return
     alreadyReset = true.
  ======================================================= */

  await system.insertOne({
    key: resetKey,

    cycle:
      currentCycle.cycle,

    name:
      currentCycle.cycleName,

    resetAt: now,

    scheduledResetAt:
      new Date(
        currentCycle.cycleStart.getTime() +
          CYCLE_LENGTH_DAYS *
            24 *
            60 *
            60 *
            1000
      ),

    usersReset:
      userResult.modifiedCount,

    mathSpiritLeaderboardDeleted:
      mathSpiritResult.deletedCount,

    cycleLeaderboardDeleted:
      cycleLeaderboardResult.deletedCount,

    globalLeaderboardDeleted:
      globalLeaderboardResult.deletedCount,

    version: 2,
  });

  /* =======================================================
     RESPONSE
  ======================================================= */

  return NextResponse.json({
    success: true,

    reset: true,

    alreadyReset: false,

    cycle:
      currentCycle.cycle,

    cycleName:
      currentCycle.cycleName,

    cycleStartedAt:
      currentCycle.cycleStart,

    usersReset:
      userResult.modifiedCount,

    geniusPoints:
      "RESET TO 0",

    currentCycleGP:
      "RESET TO 0",

    streak:
      "RESET TO 0",

    solvedFlags:
      "RESET TO FALSE",

    stats:
      "RESET TO 0",

    globalLeaderboard:
      "DELETED",

    cycleLeaderboard:
      "DELETED",

    mathSpiritLeaderboard:
      "DELETED",

    message:
      `${currentCycle.cycleName} was reset successfully. This cycle will NOT reset again.`,
  });
}

/* =========================================================
   GET
========================================================= */

export async function GET() {
  try {
    return await performReset();
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

        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
========================================================= */

export async function POST() {
  try {
    return await performReset();
  } catch (error) {
    console.error(
      "CYCLE RESET POST ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "Cycle reset failed.",

        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}