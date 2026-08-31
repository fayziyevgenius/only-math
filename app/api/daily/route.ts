import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
  GENESIS_END_DATE,
  GENESIS_START_DATE,
  getQuestionForDay,
} from "@/lib/dailyQuestions";

export const dynamic = "force-dynamic";

const CYCLE_NAME = "Genesis Cycle";

function getTashkentDateKey(): string {
  const formatter = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Asia/Tashkent",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  const parts = formatter.formatToParts(
    new Date()
  );

  const year = parts.find(
    (part) => part.type === "year"
  )?.value;

  const month = parts.find(
    (part) => part.type === "month"
  )?.value;

  const day = parts.find(
    (part) => part.type === "day"
  )?.value;

  return `${year}-${month}-${day}`;
}

function dateToUtc(dateKey: string) {
  return new Date(`${dateKey}T00:00:00Z`);
}

function getCycleDay(
  dateKey: string
): number | null {
  const start = dateToUtc(
    GENESIS_START_DATE
  );

  const end = dateToUtc(
    GENESIS_END_DATE
  );

  const current = dateToUtc(dateKey);

  if (
    current < start ||
    current > end
  ) {
    return null;
  }

  const difference =
    current.getTime() -
    start.getTime();

  return (
    Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ) + 1
  );
}

function getRank(totalPoints: number) {
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

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const username = body?.username;
    const answer = body?.answer;

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

    if (
      typeof answer !== "string"
    ) {
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

    const db = await connectDB();

    const user =
      await db
        .collection("users")
        .findOne({
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

    const today =
      getTashkentDateKey();

    const cycleDay =
      getCycleDay(today);

    /*
     * Genesis Cycle is active only
     * from 17 August through 30 August.
     */

    if (cycleDay === null) {
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

    const question =
      getQuestionForDay(
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

    /*
     * Prevent multiple submissions
     * for the same day.
     */

    const lastDailyDate =
      user.lastDailyDate;

    if (
      lastDailyDate === today
    ) {
      return NextResponse.json(
        {
          error:
            "You have already completed today's Daily Challenge.",
        },
        {
          status: 400,
        }
      );
    }

    const submittedAnswer =
      answer.trim();

    const isCorrect =
      submittedAnswer ===
      question.correctAnswer;

    const points = isCorrect
      ? question.points
      : 0;

    const correct =
      isCorrect ? 1 : 0;

    const incorrect =
      isCorrect ? 0 : 1;

    const oldTitle =
      user.title ||
      "🌱 Beginner";

    const currentGlobalPoints =
      Number(
        user.geniusPoints || 0
      );

    const newGlobalPoints =
      currentGlobalPoints +
      points;

    const newTitle =
      getRank(
        newGlobalPoints
      );

    /*
     * Cycle GP is separate from
     * Global GP.
     */

    const currentCyclePoints =
      Number(
        user.currentCycleGP || 0
      );

    const newCyclePoints =
      currentCyclePoints +
      points;

    const update: any = {
      $set: {
        lastDailyDate: today,
        lastDailyCycleDay:
          cycleDay,
        lastDailyCycle:
          CYCLE_NAME,
        title: newTitle,
        currentCycleGP:
          newCyclePoints,
      },

      $inc: {
        geniusPoints: points,

        "stats.daily.attempts": 1,
        "stats.daily.correct": correct,
        "stats.daily.incorrect":
          incorrect,
      },
    };

    /*
     * Streak
     */

    if (
      user.lastSolvedDate !==
      today
    ) {
      update.$inc.streak = 1;

      update.$set.lastSolvedDate =
        today;
    }

    await db
      .collection("users")
      .updateOne(
        {
          username,
        },
        update
      );

    /*
     * Save Daily submission.
     *
     * This gives us a real server-side
     * history and prevents relying only
     * on localStorage.
     */

    await db
      .collection("daily_submissions")
      .insertOne({
        username,

        cycle: CYCLE_NAME,

        cycleDay,

        date: today,

        questionId:
          question.id,

        category:
          question.category,

        answer:
          submittedAnswer,

        correct:
          isCorrect,

        points,

        createdAt:
          new Date(),
      });

    return NextResponse.json({
      success: true,

      cycle: CYCLE_NAME,

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
    });
  } catch (error) {
    console.error(
      "Daily API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}