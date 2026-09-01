import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
  getQuestionForDay,
  getCycleForDate,
} from "@/lib/dailyQuestions";

export const dynamic = "force-dynamic";

/* =========================================================
   TASHKENT DATE
========================================================= */

function getTashkentDateKey(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const year =
    parts.find((part) => part.type === "year")?.value ?? "";

  const month =
    parts.find((part) => part.type === "month")?.value ?? "";

  const day =
    parts.find((part) => part.type === "day")?.value ?? "";

  return `${year}-${month}-${day}`;
}

/* =========================================================
   RANK
========================================================= */

function getRank(totalPoints: number): string {
  if (totalPoints >= 3000) {
    return "👑 Math Genius";
  }

  if (totalPoints >= 1500) {
    return "💎 Diamond";
  }

  if (totalPoints >= 700) {
    return "🥇 Gold";
  }

  if (totalPoints >= 300) {
    return "🥈 Silver";
  }

  if (totalPoints >= 100) {
    return "🥉 Bronze";
  }

  return "🌱 Beginner";
}

/* =========================================================
   GET
   Today's Daily Question
========================================================= */

export async function GET(req: Request) {
  try {
    const { searchParams } =
      new URL(req.url);

    const username =
      searchParams.get("username")?.trim() || "";

    /* =======================================================
       TODAY
    ======================================================= */

    const today =
      getTashkentDateKey();

    /* =======================================================
       ACTIVE CYCLE
       
       Genesis:
       17 Aug → 30 Aug

       Independence:
       31 Aug → 13 Sep
    ======================================================= */

    const activeCycle =
      getCycleForDate(today);

    if (!activeCycle) {
      return NextResponse.json(
        {
          success: true,
          active: false,
          question: null,
          message:
            "There is no active Daily Challenge today.",
        },
        {
          status: 200,
          headers: {
            "Cache-Control":
              "no-store, max-age=0",
          },
        }
      );
    }

    const {
      cycle,
      name: cycleName,
      day: cycleDay,
    } = activeCycle;

    /* =======================================================
       GET QUESTION
    ======================================================= */

    const question =
      getQuestionForDay(
        cycle,
        cycleDay
      );

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Today's Daily Challenge is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /* =======================================================
       USER STATUS
       
       username berilsa:
       today's question completed yoki yo'qligini
       ham qaytaramiz.
    ======================================================= */

    let completed = false;

    let userStats = null;

    if (username) {
      const db =
        await connectDB();

      const user =
        await db
          .collection("users")
          .findOne(
            { username },
            {
              projection: {
                _id: 0,
                username: 1,
                geniusPoints: 1,
                currentCycleGP: 1,
                streak: 1,
                lastDailyDate: 1,
                lastDailyCycle: 1,
                lastDailyCycleDay: 1,
                title: 1,
                "stats.daily": 1,
              },
            }
          );

      if (user) {
        completed =
          user.lastDailyDate ===
          today;

        userStats = {
          geniusPoints:
            Number(
              user.geniusPoints || 0
            ),

          currentCycleGP:
            Number(
              user.currentCycleGP || 0
            ),

          streak:
            Number(
              user.streak || 0
            ),

          title:
            user.title ||
            getRank(
              Number(
                user.geniusPoints || 0
              )
            ),

          daily:
            user.stats?.daily || {
              attempts: 0,
              correct: 0,
              incorrect: 0,
            },
        };
      }
    }

    /* =======================================================
       RESPONSE
    ======================================================= */

    return NextResponse.json(
      {
        success: true,

        active: true,

        cycle,

        cycleName,

        cycleDay,

        date: today,

        completed,

        question: {
          id: question.id,

          day: question.day,

          cycle: question.cycle,

          category:
            question.category,

          title:
            question.title,

          question:
            question.question,

          options:
            question.options,

          points:
            question.points,

          table:
            question.table || null,
        },

        user: userStats,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error(
      "Daily GET API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to load Daily Challenge.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST
   Submit Today's Daily Question
========================================================= */

export async function POST(req: Request) {
  try {
    const body =
      await req.json();

    const username =
      String(
        body?.username || ""
      ).trim();

    const answer =
      typeof body?.answer === "string"
        ? body.answer.trim()
        : "";

    /* =======================================================
       VALIDATION
    ======================================================= */

    if (!username) {
      return NextResponse.json(
        {
          error:
            "Username is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!answer) {
      return NextResponse.json(
        {
          error:
            "Answer is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =======================================================
       DATABASE
    ======================================================= */

    const db =
      await connectDB();

    const users =
      db.collection("users");

    const user =
      await users.findOne({
        username,
      });

    if (!user) {
      return NextResponse.json(
        {
          error:
            "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* =======================================================
       TODAY
    ======================================================= */

    const today =
      getTashkentDateKey();

    /* =======================================================
       ACTIVE CYCLE
    ======================================================= */

    const activeCycle =
      getCycleForDate(today);

    if (!activeCycle) {
      return NextResponse.json(
        {
          error:
            "There is no active Daily Challenge today.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      cycle,
      name: cycleName,
      day: cycleDay,
    } = activeCycle;

    /* =======================================================
       TODAY'S QUESTION
    ======================================================= */

    const question =
      getQuestionForDay(
        cycle,
        cycleDay
      );

    if (!question) {
      return NextResponse.json(
        {
          error:
            "Today's Daily Challenge is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    /* =======================================================
       DUPLICATE SUBMISSION
       
       Har cycleda har kun faqat 1 marta.
    ======================================================= */

    if (
      user.lastDailyDate ===
      today
    ) {
      return NextResponse.json(
        {
          success: false,

          alreadyCompleted: true,

          error:
            "You have already completed today's Daily Challenge.",
        },
        {
          status: 400,
        }
      );
    }

    /* =======================================================
       CHECK ANSWER
    ======================================================= */

    const isCorrect =
      answer ===
      question.correctAnswer;

    const points =
      isCorrect
        ? question.points
        : 0;

    const correct =
      isCorrect ? 1 : 0;

    const incorrect =
      isCorrect ? 0 : 1;

    /* =======================================================
       GLOBAL GP
       
       Global GP bu yerda RESET QILINMAYDI.
    ======================================================= */

    const currentGlobalPoints =
      Number(
        user.geniusPoints || 0
      );

    const newGlobalPoints =
      currentGlobalPoints +
      points;

    /* =======================================================
       TITLE
    ======================================================= */

    const oldTitle =
      user.title ||
      getRank(
        currentGlobalPoints
      );

    const newTitle =
      getRank(
        newGlobalPoints
      );

    /* =======================================================
       CURRENT CYCLE GP
    ======================================================= */

    const currentCyclePoints =
      Number(
        user.currentCycleGP || 0
      );

    const newCyclePoints =
      currentCyclePoints +
      points;

    /* =======================================================
       UPDATE
    ======================================================= */

    const update: any = {
      $set: {
        lastDailyDate:
          today,

        lastDailyCycleDay:
          cycleDay,

        lastDailyCycle:
          cycleName,

        title:
          newTitle,

        currentCycleGP:
          newCyclePoints,
      },

      $inc: {
        geniusPoints:
          points,

        "stats.daily.attempts":
          1,

        "stats.daily.correct":
          correct,

        "stats.daily.incorrect":
          incorrect,
      },
    };

    /* =======================================================
       STREAK
    ======================================================= */

    if (
      user.lastSolvedDate !==
      today
    ) {
      update.$inc.streak = 1;

      update.$set.lastSolvedDate =
        today;
    }

    /* =======================================================
       SAVE USER
    ======================================================= */

    await users.updateOne(
      {
        username,
      },
      update
    );

    /* =======================================================
       SAVE SUBMISSION
    ======================================================= */

    await db
      .collection(
        "daily_submissions"
      )
      .insertOne({
        username,

        cycle,

        cycleName,

        cycleDay,

        date: today,

        questionId:
          question.id,

        category:
          question.category,

        answer,

        correct:
          isCorrect,

        points,

        createdAt:
          new Date(),
      });

    /* =======================================================
       RESPONSE
    ======================================================= */

    return NextResponse.json(
      {
        success: true,

        cycle,

        cycleName,

        cycleDay,

        date: today,

        questionId:
          question.id,

        category:
          question.category,

        points,

        correct,

        incorrect,

        globalPoints:
          newGlobalPoints,

        cyclePoints:
          newCyclePoints,

        rankUp:
          oldTitle !==
          newTitle,

        oldRank:
          oldTitle,

        newRank:
          newTitle,

        message: isCorrect
          ? `Correct! You received ${points} GP.`
          : "Incorrect answer. +0 GP.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Daily POST API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}