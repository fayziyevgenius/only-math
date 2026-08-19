import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

/* =========================================================
   ANSWERS
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
  11: "D",
  12: "C",
  13: "B",
  14: "A",
  15: "A",
  16: "C",
  17: "D",
  18: "C",
  19: "B",
  20: "C",
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
========================================================= */

function getUserAnswer(
  answers: unknown,
  questionNumber: number
): string {
  if (!answers) {
    return "";
  }

  /*
   * Array format:
   * ["C", "A", "A", ...]
   */
  if (Array.isArray(answers)) {
    return normalizeAnswer(
      answers[questionNumber - 1]
    );
  }

  /*
   * Object format:
   * {
   *   "1": "C",
   *   "2": "A"
   * }
   */
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
   GET TITLE
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
    const body = await req.json();

    console.log("========== SAT SUBMIT ==========");
    console.log(
      "BODY:",
      JSON.stringify(body, null, 2)
    );

    const username = String(
      body?.username || ""
    ).trim();

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
        {
          status: 400,
        }
      );
    }

    if (!answers) {
      return NextResponse.json(
        {
          error: "Answers kerak.",
        },
        {
          status: 400,
        }
      );
    }

    if (!cycle) {
      return NextResponse.json(
        {
          error: "Cycle kerak.",
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
      console.log(
        "SAT USER NOT FOUND:",
        username
      );

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
       CHECK ALREADY SOLVED
    ===================================================== */

    if (user[solvedField]) {
      return NextResponse.json(
        {
          error:
            "You have already completed this SAT test.",
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
      const userAnswer =
        getUserAnswer(
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
       CURRENT STATS
    ===================================================== */

    const currentSatAttempts = Number(
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

    /* =====================================================
       NEW STATS AFTER THIS SUBMISSION
    ===================================================== */

    const newSatAttempts =
      currentSatAttempts + totalQuestions;

    const newCertificateAttempts =
      currentCertificateAttempts;

    const newOlympiadAttempts =
      currentOlympiadAttempts;

    /* =====================================================
       PERFECT TRIO
       
       SAT       >= 20
       CERTIFICATE >= 20
       OLYMPIAD  >= 20

       bo'lsa unlock qilamiz.
    ===================================================== */

    const perfectTrio =
      newSatAttempts >= 20 &&
      newCertificateAttempts >= 20 &&
      newOlympiadAttempts >= 20;

    const alreadyPerfectTrio =
      user.perfectTrio === true;

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

    const title =
      getTitle(totalPoints);

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

        /*
         * Bu doimiy ravishda MongoDB'da
         * saqlanadi.
         */
        perfectTrio,
      },

      $inc: {
        geniusPoints: points,

        /*
         * SAT nechta savol bajarilganini
         * saqlaymiz.
         */
        "stats.sat.attempts":
          totalQuestions,

        /*
         * SAT nechta to'g'ri ishlangan.
         */
        "stats.sat.correct":
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
        new Date();

      console.log(
        "🎉 PERFECT TRIO UNLOCKED!"
      );
    }

    /* =====================================================
       STREAK
    ===================================================== */

    if (
      user.lastSolvedDate !== today
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

      /*
       * Frontend uchun.
       */
      satCompleted:
        newSatAttempts >= 20,

      certificateCompleted:
        newCertificateAttempts >= 20,

      olympiadCompleted:
        newOlympiadAttempts >= 20,

      perfectTrio,

      perfectTrioUnlocked:
        perfectTrio &&
        !alreadyPerfectTrio,

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
      {
        status: 500,
      }
    );
  }
}