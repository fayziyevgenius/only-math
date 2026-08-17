import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   ANSWERS
========================================================= */

const genesisAnswers: Record<number, string> = {
  1: "2",
  2: "0",
  3: "0",
  4: "0",
  5: "0",
  6: "0",
  7: "1",
  8: "3",
  9: "0",
  10: "3",
  11: "3",
  12: "2",
  13: "1",
  14: "0",
  15: "0",
  16: "2",
  17: "3",
  18: "2",
  19: "1",
  20: "2",
};

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

function normalizeAnswer(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value)
    .trim()
    .toUpperCase();
}

/* =========================================================
   GET USER ANSWER
   Supports BOTH:

   {
     1: "C",
     2: "A"
   }

   AND

   ["C", "A"]
========================================================= */

function getUserAnswer(
  answers: unknown,
  questionNumber: number
): string {
  if (!answers) {
    return "";
  }

  // Array format:
  // ["C", "A", "A", ...]
  if (Array.isArray(answers)) {
    return normalizeAnswer(
      answers[questionNumber - 1]
    );
  }

  // Object format:
  // { "1": "C", "2": "A" }
  if (typeof answers === "object") {
    const answerObject =
      answers as Record<string, unknown>;

    return normalizeAnswer(
      answerObject[String(questionNumber)]
    );
  }

  return "";
}

/* =========================================================
   POST
========================================================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("========== SAT SUBMIT ==========");
    console.log("BODY:", JSON.stringify(body, null, 2));

    const username = body?.username;
    const answers = body?.answers;
    const cycle = body?.cycle;

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!username) {
      return NextResponse.json(
        {
          error: "Username kerak.",
        },
        { status: 400 }
      );
    }

    if (!answers) {
      return NextResponse.json(
        {
          error: "Answers kerak.",
        },
        { status: 400 }
      );
    }

    if (!cycle) {
      return NextResponse.json(
        {
          error: "Cycle kerak.",
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
       CALCULATE SCORE
    ===================================================== */

    let correct = 0;

    const results: {
      question: number;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }[] = [];

    for (
      let questionNumber = 1;
      questionNumber <= totalQuestions;
      questionNumber++
    ) {
      const userAnswer = getUserAnswer(
        answers,
        questionNumber
      );

      const correctAnswer =
        normalizeAnswer(
          correctAnswers[questionNumber]
        );

      const isCorrect =
        userAnswer === correctAnswer;

      if (isCorrect) {
        correct++;
      }

      results.push({
        question: questionNumber,
        userAnswer,
        correctAnswer,
        isCorrect,
      });
    }

    const incorrect =
      totalQuestions - correct;

    const points =
      correct * POINTS_PER_QUESTION;

    /* =====================================================
       DEBUG
    ===================================================== */

    console.log(
      "CYCLE:",
      cycle
    );

    console.log(
      "TOTAL QUESTIONS:",
      totalQuestions
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
      "RESULTS:",
      JSON.stringify(
        results,
        null,
        2
      )
    );

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
      currentPoints + points;

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
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Asia/Tashkent",
        }
      ).format(new Date());

    /* =====================================================
       UPDATE
    ===================================================== */

    const update: any = {
      $set: {
        [solvedField]: true,
        title,
        updatedAt: new Date(),
        lastSATCycle: cycle,
      },

      $inc: {
        geniusPoints: points,

        /*
         * MUHIM:
         * Account page stats.sat.attempts
         * va stats.sat.correct ni o'qiydi.
         *
         * Shuning uchun aynan shu fieldlarga yozamiz.
         */
        "stats.sat.attempts":
          totalQuestions,

        "stats.sat.correct":
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
       DATABASE UPDATE
    ===================================================== */

    const updateResult =
      await users.updateOne(
        {
          username,
        },
        update
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

      total: totalQuestions,

      rankUp:
        oldTitle !== title,

      oldRank:
        oldTitle,

      newRank:
        title,

      results,

      message:
        correct === totalQuestions
          ? "Perfect! You solved every SAT question correctly."
          : `You received ${points} Genius Points.`,
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