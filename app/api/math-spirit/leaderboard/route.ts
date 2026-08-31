import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type SprintDocument = {
  username?: string;
  score?: number;
  correct?: number;
  wrong?: number;
  bestCombo?: number;
};

type UserDocument = {
  username?: string;
  name?: string;
  surname?: string;
  avatar?: string;
};

export async function GET() {
  try {
    const db = await connectDB();

    const leaderboard =
      db.collection<SprintDocument>(
        "math_spirit_leaderboard"
      );

    const users =
      db.collection<UserDocument>(
        "users"
      );

    const rankings =
      await leaderboard
        .find({})
        .sort({
          score: -1,
          bestCombo: -1,
        })
        .toArray();

    const result =
      await Promise.all(
        rankings.map(
          async (ranking) => {

            const user =
              await users.findOne(
                {
                  username:
                    ranking.username,
                },
                {
                  projection: {
                    _id: 0,
                    username: 1,
                    name: 1,
                    surname: 1,
                    avatar: 1,
                  },
                }
              );

            return {
              username:
                ranking.username ||
                "Unknown",

              name:
                user?.name ||
                ranking.username ||
                "Unknown",

              surname:
                user?.surname || "",

              score:
                Number(ranking.score) ||
                0,

              correct:
                Number(
                  ranking.correct
                ) || 0,

              wrong:
                Number(
                  ranking.wrong
                ) || 0,

              bestCombo:
                Number(
                  ranking.bestCombo
                ) || 0,

              avatar:
                user?.avatar ||
                "only-math",
            };
          }
        )
      );

    return NextResponse.json(
      result,
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
      "Math Sprint leaderboard error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load Math Sprint leaderboard.",
      },
      {
        status: 500,
      }
    );
  }
}