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
  ======================================================= */

  const resetKey =
    `cycle-reset-${currentCycle.cycle}`;

  const existingMarker =
    await system.findOne({
      key: resetKey,
    });

  /* =======================================================
     CHECK IF RESET IS REALLY COMPLETE
     
     IMPORTANT:
     We DO NOT trust the marker alone.
     
     Even if cycle-reset-2 exists, we check whether
     users are actually reset.
  ======================================================= */

  const usersNeedingReset =
    await users.findOne({
      $or: [
        {
          geniusPoints: {
            $ne: 0,
          },
        },

        {
          currentCycleGP: {
            $ne: 0,
          },
        },

        {
          currentCycle: {
            $ne: currentCycle.cycle,
          },
        },

        {
          streak: {
            $ne: 0,
          },
        },

        {
          certificateSolved: true,
        },

        {
          satSolved: true,
        },

        {
          olympiadSolved: true,
        },

        {
          dailySolved: true,
        },

        {
          "stats.national.attempts": {
            $ne: 0,
          },
        },

        {
          "stats.national.correct": {
            $ne: 0,
          },
        },

        {
          "stats.sat.attempts": {
            $ne: 0,
          },
        },

        {
          "stats.sat.correct": {
            $ne: 0,
          },
        },

        {
          "stats.olympiad.attempts": {
            $ne: 0,
          },
        },

        {
          "stats.olympiad.correct": {
            $ne: 0,
          },
        },

        {
          "stats.daily.attempts": {
            $ne: 0,
          },
        },

        {
          "stats.daily.correct": {
            $ne: 0,
          },
        },

        {
          "stats.mathSpirit.games": {
            $ne: 0,
          },
        },

        {
          "stats.mathSpirit.highestScore": {
            $ne: 0,
          },
        },

        {
          "stats.mathSpirit.totalScore": {
            $ne: 0,
          },
        },

        {
          "stats.mathSpirit.bestCombo": {
            $ne: 0,
          },
        },
      ],
    });

  /* =======================================================
     ALREADY FULLY RESET
  ======================================================= */

  if (
    existingMarker &&
    !usersNeedingReset
  ) {
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
        `${currentCycle.cycleName} has already been fully reset.`,
    });
  }

  /* =======================================================
     RESET ALL USERS
     
     EVERYTHING IMPORTANT = 0 / false
  ======================================================= */

  const userResult =
    await users.updateMany(
      {},
      {
        $set: {
          /* -----------------------------------------------
             GLOBAL SCORE
          ------------------------------------------------ */

          geniusPoints: 0,

          /* -----------------------------------------------
             CYCLE SCORE
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
             GUESS PASSWORD
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
     RESET GLOBAL LEADERBOARD
  ======================================================= */

  const globalLeaderboard =
    db.collection("leaderboard");

  const globalLeaderboardResult =
    await globalLeaderboard.deleteMany(
      {}
    );

  /* =======================================================
     SAVE / UPDATE RESET MARKER
  ======================================================= */

  await system.updateOne(
    {
      key: resetKey,
    },
    {
      $set: {
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

        globalLeaderboardDeleted:
          globalLeaderboardResult.deletedCount,

        repaired:
          Boolean(existingMarker),
      },
    },
    {
      upsert: true,
    }
  );

  /* =======================================================
     RESPONSE
  ======================================================= */

  return NextResponse.json({
    success: true,

    reset: true,

    repaired:
      Boolean(existingMarker),

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
      `${currentCycle.cycleName} has been fully reset.`,
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