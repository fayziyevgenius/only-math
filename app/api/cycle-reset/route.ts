import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   CYCLE CONFIG
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
   RESET CYCLE
========================================================= */

async function performReset() {
  const now = new Date();

  const currentCycle =
    getCurrentCycle(now);

  /* =======================================================
     NO CYCLE
  ======================================================= */

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
     CHECK WHETHER USERS ARE ALREADY ON CURRENT CYCLE
  ======================================================= */

  const usersStillOnOldCycle =
    await users.findOne({
      currentCycle: {
        $ne: currentCycle.cycle,
      },
    });

  /*
    Agar marker mavjud bo'lsa ham, lekin userlar hali
    eski cycle'da bo'lsa, resetni qayta bajarish mumkin.

    Bu bizning hozirgi holatimiz uchun MUHIM:
    cycle-reset-2 marker bor, lekin Habiba currentCycle: 1.
  */

  if (
    existingMarker &&
    !usersStillOnOldCycle
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
     RESET USERS
     
     IMPORTANT:
     geniusPoints IS NOT RESET.
     
     It belongs to GLOBAL SCORE.
  ======================================================= */

  const userResult =
    await users.updateMany(
      {},
      {
        $set: {
          /* -----------------------------------------------
             KEEP:
             geniusPoints
             
             We intentionally DO NOT touch it.
          ------------------------------------------------ */

          /* -----------------------------------------------
             CURRENT CYCLE
          ------------------------------------------------ */

          currentCycle:
            currentCycle.cycle,

          currentCycleGP: 0,

          /* -----------------------------------------------
             TITLE
             
             We also DO NOT reset title because title can
             represent global achievement.
          ------------------------------------------------ */

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
             CURRENT CYCLE SOLVED FLAGS
          ------------------------------------------------ */

          certificateSolved: false,

          satSolved: false,

          olympiadSolved: false,

          dailySolved: false,

          /* -----------------------------------------------
             CURRENT CYCLE DAILY
          ------------------------------------------------ */

          lastDailyCycle:
            currentCycle.cycleName,

          lastDailyCycleDay: 0,

          /* -----------------------------------------------
             CURRENT CYCLE STATS
          ------------------------------------------------ */

          "stats.national.attempts": 0,

          "stats.national.correct": 0,

          "stats.sat.attempts": 0,

          "stats.sat.correct": 0,

          "stats.olympiad.attempts": 0,

          "stats.olympiad.correct": 0,

          "stats.daily.attempts": 0,

          "stats.daily.correct": 0,

          /* -----------------------------------------------
             MATH SPIRIT CURRENT CYCLE
          ------------------------------------------------ */

          "stats.mathSpirit.games": 0,

          "stats.mathSpirit.highestScore": 0,

          "stats.mathSpirit.totalScore": 0,

          "stats.mathSpirit.bestCombo": 0,

          /* -----------------------------------------------
             REMOVE OLD GENESIS FLAGS
          ------------------------------------------------ */

          olympiadGenesisSolved: false,

          satGenesisSolved: false,

          lastSATCycle: null,
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
     
     !!! DO NOT TOUCH !!!
  ======================================================= */

  /*
     db.collection("leaderboard")
     
     HECH QACHON DELETE QILINMAYDI.
     
     geniusPoints ham reset qilinmaydi.
  */

  /* =======================================================
     UPDATE / CREATE RESET MARKER
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

        repaired:
          existingMarker ? true : false,
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

    cycleStartedAt:
      currentCycle.cycleStart,

    usersReset:
      userResult.modifiedCount,

    mathSpiritLeaderboardDeleted:
      mathSpiritResult.deletedCount,

    cycleLeaderboardDeleted:
      cycleLeaderboardResult.deletedCount,

    geniusPoints:
      "NOT RESET",

    globalLeaderboard:
      "NOT DELETED",

    message:
      `${currentCycle.cycleName} has started. Cycle scores have been reset while global scores remain unchanged.`,
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
      },
      {
        status: 500,
      }
    );
  }
}