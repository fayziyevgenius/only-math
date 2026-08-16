import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   CYCLE
========================================================= */

type CycleName = "genesis" | "independence";

function getCurrentCycle(): CycleName | null {
  const formatter = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  const today = formatter.format(new Date());

  if (
    today >= "2026-08-17" &&
    today <= "2026-08-30"
  ) {
    return "genesis";
  }

  if (
    today >= "2026-08-31" &&
    today <= "2026-09-13"
  ) {
    return "independence";
  }

  return null;
}

/* =========================================================
   GENESIS ANSWERS
   INDEX = CORRECT OPTION
========================================================= */

const genesisAnswers: Record<string, number> = {
  "1": 3,
  "2": 0,
  "3": 0,
  "4": 0,
  "5": 0,
  "6": 3,
  "7": 1,
  "8": 3,
  "9": 0,
  "10": 3,
  "11": 1,
  "12": 2,
  "13": 1,
  "14": 0,
  "15": 0,
  "16": 2,
  "17": 3,
  "18": 2,
  "19": 1,
  "20": 2,
};

/* =========================================================
   INDEPENDENCE ANSWERS
   INDEX = CORRECT OPTION
========================================================= */

const independenceAnswers: Record<string, number> = {
  "1": 1,
  "2": 3,
  "3": 2,
  "4": 0,
  "5": 2,
  "6": 0,
  "7": 3,
  "8": 0,
  "9": 0,
  "10": 3,
  "11": 1,
  "12": 3,
  "13": 0,
  "14": 0,
  "15": 1,
  "16": 1,
  "17": 0,

  /*
    Q18 diagram savolining to'g'ri javobi
    hozircha berilmagan.
  */
};

/* =========================================================
   TITLE
========================================================= */

function getTitle(points: number) {
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

    if (
      !answers ||
      typeof answers !== "object"
    ) {
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
          error:
            "Certificate is not currently available.",
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

    const totalQuestions =
      Object.keys(correctAnswers).length;

    /* =====================================================
       DATABASE
    ===================================================== */

    const db = await connectDB();

    const users =
      db.collection("users");

    const user =
      await users.findOne({
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

    const certificateCycles =
      user.certificateCycles || {};

    const currentCycleData =
      certificateCycles[cycle];

    if (
      currentCycleData &&
      currentCycleData.solved === true
    ) {
      return NextResponse.json(
        {
          error:
            cycle === "genesis"
              ? "You have already completed the Genesis Certificate."
              : "You have already completed the Independence Certificate.",
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

    for (
      const questionId of Object.keys(
        correctAnswers
      )
    ) {
      const userAnswer =
        answers[questionId];

      const correctAnswer =
        correctAnswers[questionId];

      if (
        userAnswer !== undefined &&
        Number(userAnswer) ===
          correctAnswer
      ) {
        correct++;
      }
    }

    const incorrect =
      totalQuestions - correct;

    /* =====================================================
       POINTS
    ===================================================== */

    const points =
      correct * 10;

    const oldTitle =
      user.title ||
      "🌱 Beginner";

    const oldPoints =
      user.geniusPoints || 0;

    const totalPoints =
      oldPoints + points;

    const newTitle =
      getTitle(totalPoints);

    const rankUp =
      oldTitle !== newTitle;

    /* =====================================================
       DATE
    ===================================================== */

    const formatter =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            "Asia/Tashkent",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      );

    const today =
      formatter.format(
        new Date()
      );

    const now = new Date();

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
       UPDATE
    ===================================================== */

    const update: any = {
      $set: {
        title: newTitle,

        [`certificateCycles.${cycle}`]:
          cycleResult,
      },

      $inc: {
        geniusPoints: points,

        "stats.certificate.attempts":
          1,

        "stats.certificate.correct":
          correct,
      },
    };

    /* =====================================================
       INDEPENDENCE → TRAINING
    ===================================================== */

    if (
      cycle ===
      "independence"
    ) {
      update.$push = {
        training: {
          source:
            "independence",

          type:
            "certificate",

          completedAt:
            now,

          correct,

          incorrect,

          totalQuestions,

          points,

          questions:
            Object.keys(
              correctAnswers
            ),
        },
      };
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

    await users.updateOne(
      {
        username,
      },
      update
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

      totalQuestions,

      rankUp,

      oldRank:
        oldTitle,

      newRank:
        newTitle,

      trainingAdded:
        cycle ===
        "independence",

      message:
        correct ===
        totalQuestions
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