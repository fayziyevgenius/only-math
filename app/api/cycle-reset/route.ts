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
   RESET
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

  /* =======================================================
     CHECK EXISTING MARKER
  ======================================================= */

  const existingMarker =
    await system.findOne({
      key: resetKey,
    });

  /* =======================================================
     CHECK USERS
  ======================================================= */

  const usersStillNeedReset =
    await users.findOne({
      currentCycle: {
        $ne: currentCycle.cycle,
      },
    });

  /*
    Agar marker mavjud bo'lsa va barcha userlar
    current cycle'da bo'lsa, qayta reset qilmaymiz.
  */

  if (
    existingMarker &&
    !usersStillNeedReset
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
        `${currentCycle.cycleName} has already been reset.`,
    });
  }

  /* =======================================================
     RESET ALL USERS
     
     EVERYTHING = 0 / false
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
             CYCLE INFO
          ------------------------------------------------ */

          currentCycle:
            currentCycle.cycle,

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
             MATH SPIRIT
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
        },

        /* =================================================
           DELETE OLD CYCLE DATA
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

          guessPasswordUnlocked: "",

          guessPasswordRewardAt: "",

          guessPasswordRewardClaimed: "",
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
     GLOBAL LEADERBOARD
     
     NOW IT MUST ALSO BE RESET
  ======================================================= */

  const globalLeaderboard =
    db.collection("leaderboard");

  const globalLeaderboardResult =
    await globalLeaderboard.deleteMany(
      {}
    );

  /* =======================================================
     RESET MARKER
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
      existingMarker ? true : false,

    cycle:
      currentCycle.cycle,

    cycleName:
      currentCycle.cycleName,

    usersReset:
      userResult.modifiedCount,

    globalScore:
      "RESET TO 0",

    mathSpiritLeaderboardDeleted:
      mathSpiritResult.deletedCount,

    cycleLeaderboardDeleted:
      cycleLeaderboardResult.deletedCount,

    globalLeaderboardDeleted:
      globalLeaderboardResult.deletedCount,

    message:
      `${currentCycle.cycleName} has started. ALL scores and progress have been reset.`,
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