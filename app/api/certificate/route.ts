import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   CYCLE
========================================================= */

type CycleName = "genesis" | "independence";

function getCurrentCycle(): CycleName | null {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const today = formatter.format(new Date());

  if (today >= "2026-08-17" && today <= "2026-08-30") {
    return "genesis";
  }

  if (today >= "2026-08-31" && today <= "2026-09-13") {
    return "independence";
  }

  return null;
}

/* =========================================================
   GENESIS ANSWERS
========================================================= */

const genesisAnswers: Record<string, number> = {
  "1": 3,
  "2": 3,
  "3": 2,
  "4": 2,
  "5": 0,
  "6": 3,
  "7": 1,
  "8": 3,
  "9": 2,
  "10": 0,
  "11": 1,
  "12": 0,
  "13": 2,
  "14": 2,
  "15": 1,
  "16": 2,
  "17": 0,
  "18": 1,
  "19": 0,
  "20": 3,
};

/* =========================================================
   INDEPENDENCE ANSWERS
========================================================= */

const independenceAnswers: Record<string, number> = {
  "1": 1,
  "2": 1,
  "3": 1,
  "4": 0,
  "5": 0,
  "6": 1,
  "7": 0,
  "8": 0,
  "9": 0,
  "10": 0,
  "11": 3,
  "12": 2,
  "13": 3,
  "14": 2,
  "15": 0,
  "16": 1,
  "17": 0,
  "18": 0,
  "19": 1,
  "20": 1,
};

/* =========================================================
   TITLE
========================================================= */

function getTitle(points: number): string {
  if (points >= 3000) {
    return "👑 Math Genius";
  }

  if (points >= 1500) {
    return "💎 Diamond";
  }

  if (points >= 700) {
    return "🥇 Gold";
  }

  if (points >= 300) {
    return "🥈 Silver";
  }

  if (points >= 100) {
    return "🥉 Bronze";
  }

  return "🌱 Beginner";
}

/* =========================================================
   POST
========================================================= */

export async function POST(req: Request) {
  try {
    const { username, answers } = await req.json();

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!username) {
      return NextResponse.json(
        {
          error: "Username is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        {
          error: "Answers are required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CURRENT CYCLE
    ===================================================== */

    const cycle = getCurrentCycle();

    if (!cycle) {
      return NextResponse.json(
        {
          error: "Certificate is not currently available.",
        },
        {
          status: 403,
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

    const totalQuestions = Object.keys(correctAnswers).length;

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
       ALREADY SOLVED
    ===================================================== */

    const certificateCycles = user.certificateCycles || {};

    const currentCycleData = certificateCycles[cycle];

    if (currentCycleData?.solved === true) {
      return NextResponse.json(
        {
          error: "You have already completed this Certificate.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       CHECK ANSWERS
    ===================================================== */

    let correct = 0;

    for (const questionId of Object.keys(correctAnswers)) {
      const userAnswer = answers[questionId];

      const correctAnswer = correctAnswers[questionId];

      if (
        userAnswer !== undefined &&
        Number(userAnswer) === correctAnswer
      ) {
        correct++;
      }
    }

    const incorrect = totalQuestions - correct;

    /* =====================================================
       POINTS
    ===================================================== */

    const points = correct * 20;

    /* =====================================================
       TITLE
    ===================================================== */

    const oldTitle = user.title || "🌱 Beginner";

    const oldPoints = Number(user.geniusPoints || 0);

    const totalPoints = oldPoints + points;

    const newTitle = getTitle(totalPoints);

    /* =====================================================
       DATE
    ===================================================== */

    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const today = formatter.format(new Date());

    const now = new Date();

    /* =====================================================
       CURRENT STATS
    ===================================================== */

    const currentSatAttempts = Number(
      user.stats?.sat?.attempts || 0
    );

    const currentCertificateAttempts = Number(
      user.stats?.national?.attempts || 0
    );

    const currentOlympiadAttempts = Number(
      user.stats?.olympiad?.attempts || 0
    );

    /* =====================================================
       NEW CERTIFICATE STATS
    ===================================================== */

    const newCertificateAttempts =
      currentCertificateAttempts + totalQuestions;

    /* =====================================================
       PERFECT TRIO
       
       SAT >= 20
       CERTIFICATE >= 20
       OLYMPIAD >= 20
    ===================================================== */

    const perfectTrio =
      currentSatAttempts >= 20 &&
      newCertificateAttempts >= 20 &&
      currentOlympiadAttempts >= 20;

    const alreadyPerfectTrio =
      user.perfectTrio === true;

    /* =====================================================
       CYCLE RESULT
    ===================================================== */

    const cycleResult = {
      solved: true,

      correct,

      incorrect,

      totalQuestions,

      points,

      completedAt: now,

      date: today,
    };

    /* =====================================================
       DATABASE UPDATE
    ===================================================== */

    const update: any = {
      $set: {
        title: newTitle,

        [`certificateCycles.${cycle}`]: cycleResult,

        updatedAt: now,

        /*
         * Perfect Trio holatini doimiy
         * MongoDB'da saqlaymiz.
         */
        perfectTrio,
      },

      $inc: {
        geniusPoints: points,

        /*
         * Certificate:
         *
         * 20 ta savol
         * = 20 attempts
         */

        "stats.national.attempts": totalQuestions,

        /*
         * Nechta to'g'ri ishlangani.
         */

        "stats.national.correct": correct,
      },
    };

    /* =====================================================
       PERFECT TRIO UNLOCK DATE
    ===================================================== */

    if (perfectTrio && !alreadyPerfectTrio) {
      update.$set.perfectTrioUnlockedAt = now;

      console.log("🎉 PERFECT TRIO UNLOCKED!");
    }

    /* =====================================================
       INDEPENDENCE → TRAINING
    ===================================================== */

    if (cycle === "independence") {
      update.$push = {
        training: {
          source: "independence",

          type: "certificate",

          completedAt: now,

          correct,

          incorrect,

          totalQuestions,

          points,

          questions: Object.keys(correctAnswers),
        },
      };
    }

    /* =====================================================
       STREAK
    ===================================================== */

    if (user.lastSolvedDate !== today) {
      update.$inc.streak = 1;

      update.$set.lastSolvedDate = today;
    }

    /* =====================================================
       SAVE
    ===================================================== */

    const updateResult = await users.updateOne(
      {
        username,
      },
      update
    );

    console.log("CERTIFICATE DATABASE UPDATE:");
    console.log(updateResult);

    /* =====================================================
       RESPONSE
    ===================================================== */

    return NextResponse.json({
      success: true,

      cycle,

      points,

      correct,

      incorrect,

      totalQuestions,

      rankUp: oldTitle !== newTitle,

      oldRank: oldTitle,

      newRank: newTitle,

      certificatePerfect:
        correct === totalQuestions,

      certificateCompleted:
        newCertificateAttempts >= 20,

      satCompleted:
        currentSatAttempts >= 20,

      olympiadCompleted:
        currentOlympiadAttempts >= 20,

      perfectTrio,

      perfectTrioUnlocked:
        perfectTrio && !alreadyPerfectTrio,

      message:
        correct === totalQuestions
          ? `Perfect! You solved all ${totalQuestions} questions correctly.`
          : `You solved ${correct} out of ${totalQuestions} questions correctly.`,
    });
  } catch (error) {
    console.error(
      "Certificate API Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}