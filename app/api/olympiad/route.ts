import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   GENESIS ANSWERS
========================================================= */

const genesisAnswers: Record<number, string> = {
  1: "C",
  2: "C",
  3: "A",
  4: "C",
  5: "D",
  6: "A",

  // 7-savol — berilgan matn/variantlar bo'yicha aniq mos kelmaydi
  7: "A",

  // 8-savol
  8: "A",

  // 9-savol
  9: "C",

  // 10-savol
  10: "B",

  // 11-savol — rasm/matn yetarli emas
  11: "C",

  // 12-savol
  12: "B",

  // 13-savol
  13: "D",

  // 14-savol
  14: "A",

  // 15-savol
  15: "B",

  // 16-savol
  16: "D",

  // 17-savol — berilgan matn bo'yicha aniq mos kelmaydi
  17: "D",

  // 18-savol
  18: "A",

  // 19-savol — berilgan matn bo'yicha aniq mos kelmaydi
  19: "C",

  // 20-savol
  20: "C",
};

/* =========================================================
   INDEPENDENCE ANSWERS

   Independence savollari:
   1–10  -> I qism
   11–20 -> II qism
========================================================= */

const independenceAnswers: Record<number, string> = {
  1: "C",
  2: "C",
  3: "B",
  4: "C",
  5: "D",
  6: "A",
  7: "B",
  8: "A",
  9: "C",
  10: "D",

  11: "D",
  12: "B",
  13: "A",
  14: "C",
  15: "B",
  16: "A",
  17: "B",
  18: "D",
  19: "C",
  20: "C",
};


/* =========================================================
   SETTINGS
========================================================= */

const POINTS_PER_QUESTION = 30;

const TOTAL_QUESTIONS = 20;


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

    const user = await db
      .collection("users")
      .findOne({
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
       SELECT ANSWER KEY
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
       CHECK IF ALREADY SOLVED
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
        answers[i] || ""
      )
        .trim()
        .toUpperCase();

      if (
        userAnswer ===
        correctAnswers[i]
      ) {
        correct++;
      }
    }

    const incorrect =
      TOTAL_QUESTIONS - correct;

    /* =====================================================
       GENIUS POINTS
    ===================================================== */

    const points =
      correct *
      POINTS_PER_QUESTION;

    /* =====================================================
       RANK
    ===================================================== */

    const oldTitle =
      user.title ||
      "🌱 Beginner";

    const currentPoints =
      Number(
        user.geniusPoints || 0
      );

    const totalPoints =
      currentPoints +
      points;

    let title =
      "🌱 Beginner";

    if (totalPoints >= 100) {
      title = "🥉 Bronze";
    }

    if (totalPoints >= 300) {
      title = "🥈 Silver";
    }

    if (totalPoints >= 700) {
      title = "🥇 Gold";
    }

    if (totalPoints >= 1500) {
      title = "💎 Diamond";
    }

    if (totalPoints >= 3000) {
      title = "👑 Math Genius";
    }

    /* =====================================================
       STREAK
    ===================================================== */

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    /* =====================================================
       DATABASE UPDATE
    ===================================================== */

    const update: any = {
      $set: {
        [solvedField]: true,
        title,
      },

      $inc: {
        geniusPoints: points,

        [`stats.olympiad.${cycle}.attempts`]:
          TOTAL_QUESTIONS,

        [`stats.olympiad.${cycle}.correct`]:
          correct,
      },
    };

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

    await db
      .collection("users")
      .updateOne(
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

      total: TOTAL_QUESTIONS,

      rankUp:
        oldTitle !== title,

      oldRank:
        oldTitle,

      newRank:
        title,

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