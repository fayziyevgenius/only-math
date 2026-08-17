import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   GENESIS ANSWERS
========================================================= */

const genesisAnswers: Record<number, string> = {
  1: "C",
  2: "A",
  3: "A",
  4: "A",
  5: "A",
  6: "A",
  7: "B",
  8: "D",
  9: "A",
  10: "D",
  11: "B",
  12: "C",
  13: "B",
  14: "A",
  15: "A",
  16: "C",
  17: "D",
  18: "C",
  19: "A",
  20: "C",
};

/* =========================================================
   INDEPENDENCE ANSWERS
========================================================= */

const independenceAnswers: Record<number, string> = {
  1: "B",
  2: "D",
  3: "C",
  4: "A",
  5: "D",
  6: "A",
  7: "D",
  8: "A",
  9: "D",
  10: "D",
  11: "B",
  12: "D",
  13: "A",
  14: "A",
  15: "B",
  16: "B",
  17: "A",
  18: "B",
  19: "B",
  20: "C",
};

/* =========================================================
   SETTINGS
========================================================= */

const POINTS_PER_QUESTION = 10;

/* =========================================================
   NORMALIZE ANSWER
========================================================= */

function normalizeAnswer(
  answer: unknown
): string {
  if (answer === undefined || answer === null) {
    return "";
  }

  return String(answer)
    .trim()
    .toUpperCase();
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
        { status: 400 }
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
        { status: 400 }
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
        { status: 404 }
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
       SOLVED FIELD
    ===================================================== */

    const solvedField =
      cycle === "genesis"
        ? "satGenesisSolved"
        : "satIndependenceSolved";

    /* =====================================================
       ALREADY COMPLETED
    ===================================================== */

    if (user[solvedField]) {
      return NextResponse.json(
        {
          error:
            "You have already completed this SAT test.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       DEBUG
    ===================================================== */

    console.log("=================================");
    console.log("SAT SUBMISSION");
    console.log("Username:", username);
    console.log("Cycle:", cycle);
    console.log("Answers received:", answers);
    console.log("Correct answers:", correctAnswers);
    console.log("=================================");

    /* =====================================================
       CALCULATE SCORE
    ===================================================== */

    let correct = 0;

    const checkedAnswers: Record<
      number,
      {
        user: string;
        correct: string;
        isCorrect: boolean;
      }
    > = {};

    for (
      let i = 1;
      i <= totalQuestions;
      i++
    ) {
      const userAnswer =
        normalizeAnswer(answers[i]);

      const correctAnswer =
        normalizeAnswer(correctAnswers[i]);

      const isCorrect =
        userAnswer === correctAnswer;

      if (isCorrect) {
        correct++;
      }

      checkedAnswers[i] = {
        user: userAnswer,
        correct: correctAnswer,
        isCorrect,
      };
    }

    const incorrect =
      totalQuestions - correct;

    const points =
      correct * POINTS_PER_QUESTION;

    /* =====================================================
       LOG RESULT
    ===================================================== */

    console.log(
      "SAT checked answers:",
      checkedAnswers
    );

    console.log(
      "SAT correct:",
      correct
    );

    console.log(
      "SAT incorrect:",
      incorrect
    );

    console.log(
      "SAT points:",
      points
    );

    /* =====================================================
       TITLE
    ===================================================== */

    const oldTitle =
      user.title || "🌱 Beginner";

    const currentPoints =
      Number(user.geniusPoints || 0);

    const totalPoints =
      currentPoints + points;

    let title = "🌱 Beginner";

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

    const today = new Date()
      .toISOString()
      .split("T")[0];

    /* =====================================================
       DATABASE UPDATE
       
       MUHIM:
       stats.sat.attempts
       stats.sat.correct

       Achievementlar aynan shu fieldlarni
       tekshiradi.
    ===================================================== */

    const update: any = {
      $set: {
        [solvedField]: true,
        title,
        lastSATCycle: cycle,
        updatedAt: new Date(),
      },

      $inc: {
        geniusPoints: points,

        "stats.sat.attempts":
          totalQuestions,

        "stats.sat.correct":
          correct,
      },
    };

    /* =====================================================
       STREAK UPDATE
    ===================================================== */

    if (
      user.lastSolvedDate !== today
    ) {
      update.$inc.streak = 1;

      update.$set.lastSolvedDate =
        today;
    }

    /* =====================================================
       DATABASE SAVE
    ===================================================== */

    const updateResult =
      await users.updateOne(
        {
          username,
        },
        update
      );

    console.log(
      "SAT DB update:",
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

      total: totalQuestions,

      rankUp:
        oldTitle !== title,

      oldRank:
        oldTitle,

      newRank:
        title,

      message:
        correct === totalQuestions
          ? "Perfect! You solved every SAT question correctly."
          : `You received ${points} Genius Points.`,

      /* DEBUG */
      checkedAnswers,
    });
  } catch (error) {
    console.error(
      "SAT submit error:",
      error
    );

    return NextResponse.json(
      {
        error: "Server Error.",
      },
      { status: 500 }
    );
  }
}