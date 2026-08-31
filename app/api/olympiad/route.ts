import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   GENESIS ANSWERS
========================================================= */

const genesisAnswers: Record<number, string> = {
  1: "C",
  2: "D",
  3: "B",
  4: "B",
  5: "C",
  6: "C",
  7: "A",
  8: "C",
  9: "B",
  10: "B",
  11: "C",
  12: "D",
  13: "B",
  14: "B",
  15: "D",
  16: "C",
  17: "B",
  18: "A",
  19: "B",
  20: "C",
};

/* =========================================================
   INDEPENDENCE ANSWERS
========================================================= */

const independenceAnswers: Record<number, string> = {
  1: "C",
  2: "D",
  3: "B",
  4: "C",
  5: "D",
  6: "A",
  7: "A",
  8: "A",
  9: "C",
  10: "D",
  11: "D",
  12: "B",
  13: "A",
  14: "C",
  15: "B",
  16: "C",
  17: "C",
  18: "D",
  19: "A",
  20: "C",
};

/* =========================================================
   SETTINGS
========================================================= */

const POINTS_PER_QUESTION = 30;
const TOTAL_QUESTIONS = 20;

/* =========================================================
   TITLE
========================================================= */

function getTitle(points: number): string {
  if (points >= 3000) return "👑 Math Genius";
  if (points >= 1500) return "💎 Diamond";
  if (points >= 700) return "🥇 Gold";
  if (points >= 300) return "🥈 Silver";
  if (points >= 100) return "🥉 Bronze";

  return "🌱 Beginner";
}

/* =========================================================
   POST
========================================================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const username = body?.username;
    const answers = body?.answers;
    const cycle = body?.cycle;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!username || !answers || !cycle) {
      return NextResponse.json(
        {
          error: "Invalid request.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      cycle !== "genesis" &&
      cycle !== "independence"
    ) {
      return NextResponse.json(
        {
          error: "Invalid cycle.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       DATABASE
    ===================================================== */

    const db = await connectDB();

    const users = db.collection("users");

    const user = await users.findOne({
      username,
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =====================================================
       ANSWER KEY
    ===================================================== */

    const correctAnswers =
      cycle === "genesis"
        ? genesisAnswers
        : independenceAnswers;

    /* =====================================================
       SOLVED FIELD
    ===================================================== */

    const solvedField =
      cycle === "genesis"
        ? "olympiadGenesisSolved"
        : "olympiadIndependenceSolved";

    /* =====================================================
       ALREADY SOLVED
    ===================================================== */

    if (user[solvedField]) {
      return NextResponse.json(
        {
          error:
            "You have already completed this Olympiad test.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CALCULATE SCORE
    ===================================================== */

    let correct = 0;

    for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
      const userAnswer = String(
        answers[i] ?? ""
      )
        .trim()
        .toUpperCase();

      const correctAnswer =
        correctAnswers[i];

      if (userAnswer === correctAnswer) {
        correct++;
      }
    }

    const incorrect =
      TOTAL_QUESTIONS - correct;

    /* =====================================================
       GENIUS POINTS
    ===================================================== */

    const points =
      correct * POINTS_PER_QUESTION;

    /* =====================================================
       RANK
    ===================================================== */

    const oldTitle =
      user.title || "🌱 Beginner";

    const currentPoints =
      Number(user.geniusPoints || 0);

    const totalPoints =
      currentPoints + points;

    const title =
      getTitle(totalPoints);

    /* =====================================================
       CURRENT STATS
    ===================================================== */

    const currentSatAttempts =
      Number(
        user.stats?.sat?.attempts || 0
      );

    const currentCertificateAttempts =
      Number(
        user.stats?.national?.attempts || 0
      );

    const currentOlympiadAttempts =
      Number(
        user.stats?.olympiad?.attempts || 0
      );

    const currentOlympiadCorrect =
      Number(
        user.stats?.olympiad?.correct || 0
      );

    /* =====================================================
       NEW OLYMPIAD STATS
    ===================================================== */

    const newOlympiadAttempts =
      currentOlympiadAttempts +
      TOTAL_QUESTIONS;

    const newOlympiadCorrect =
      currentOlympiadCorrect +
      correct;

    /* =====================================================
       PERFECT TRIO
       
       SAT >= 20
       Certificate >= 20
       Olympiad >= 20
    ===================================================== */

    const perfectTrio =
      currentSatAttempts >= 20 &&
      currentCertificateAttempts >= 20 &&
      newOlympiadAttempts >= 20;

    const alreadyPerfectTrio =
      user.perfectTrio === true;

    /* =====================================================
       DATE
    ===================================================== */

    const today =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Asia/Tashkent",
        }
      ).format(new Date());

    const now = new Date();

    /* =====================================================
       UPDATE
    ===================================================== */

    const update: any = {
      $set: {
        [solvedField]: true,

        title,

        updatedAt: now,

        lastOlympiadCycle:
          cycle,

        /*
         * Perfect Trio holati
         */
        perfectTrio,
      },

      $inc: {
        geniusPoints: points,

        /*
         * MUHIM:
         *
         * Oldingi kod:
         *
         * stats.olympiad.genesis.attempts
         *
         * edi.
         *
         * Endi:
         *
         * stats.olympiad.attempts
         *
         * stats.olympiad.correct
         *
         * bo'ladi.
         */

        "stats.olympiad.attempts":
          TOTAL_QUESTIONS,

        "stats.olympiad.correct":
          correct,
      },
    };

    /* =====================================================
       PERFECT TRIO UNLOCK DATE
    ===================================================== */

    if (
      perfectTrio &&
      !alreadyPerfectTrio
    ) {
      update.$set.perfectTrioUnlockedAt =
        now;

      console.log(
        "🎉 PERFECT TRIO UNLOCKED!"
      );
    }

    /* =====================================================
       STREAK
    ===================================================== */

    if (
      user.lastSolvedDate !==
      today
    ) {
      update.$inc.streak = 1;

      update.$set.lastSolvedDate =
        today;
    }

    /* =====================================================
       SAVE
    ===================================================== */

    const updateResult =
      await users.updateOne(
        {
          username,
        },
        update
      );

    console.log(
      "========== OLYMPIAD SUBMIT =========="
    );

    console.log(
      "USERNAME:",
      username
    );

    console.log(
      "CYCLE:",
      cycle
    );

    console.log(
      "CORRECT:",
      correct
    );

    console.log(
      "INCORRECT:",
      incorrect
    );

    console.log(
      "POINTS:",
      points
    );

    console.log(
      "SAT ATTEMPTS:",
      currentSatAttempts
    );

    console.log(
      "CERTIFICATE ATTEMPTS:",
      currentCertificateAttempts
    );

    console.log(
      "OLYMPIAD ATTEMPTS:",
      newOlympiadAttempts
    );

    console.log(
      "PERFECT TRIO:",
      perfectTrio
    );

    console.log(
      "DATABASE UPDATE:",
      updateResult
    );

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      success: true,

      cycle,

      points,

      correct,

      incorrect,

      total: TOTAL_QUESTIONS,

      rankUp:
        oldTitle !== title,

      oldRank:
        oldTitle,

      newRank:
        title,

      olympiadCompleted:
        newOlympiadAttempts >= 20,

      satCompleted:
        currentSatAttempts >= 20,

      certificateCompleted:
        currentCertificateAttempts >= 20,

      perfectTrio,

      perfectTrioUnlocked:
        perfectTrio &&
        !alreadyPerfectTrio,

      message:
        correct ===
        TOTAL_QUESTIONS
          ? "Perfect! You solved every Olympiad question correctly."
          : `You received ${points} Genius Points.`,
    });
  } catch (error) {
    console.error(
      "Olympiad submit error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error.",
      },
      {
        status: 500,
      }
    );
  }
}