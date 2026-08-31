import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type UserDocument = {
  username?: string;
  name?: string;
  surname?: string;
  geniusPoints?: number;
  title?: string;
  avatar?: string;
};

function getRank(points: number): string {
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

export async function GET() {
  try {
    const db = await connectDB();

    const users =
      db.collection<UserDocument>("users");

    const usersList = await users
      .find({})
      .sort({
        geniusPoints: -1,
        username: 1,
      })
      .project({
        _id: 0,
        username: 1,
        name: 1,
        surname: 1,
        geniusPoints: 1,
        title: 1,
        avatar: 1,
      })
      .toArray();

    const result = usersList.map(
      (user, index) => {
        const points =
          Number(user.geniusPoints) || 0;

        return {
          rank: index + 1,

          username:
            user.username || "Unknown",

          name:
            user.name || "",

          surname:
            user.surname || "",

          geniusPoints: points,

          title: getRank(points),

          avatar:
            user.avatar || "only-math",
        };
      }
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
      "Global leaderboard error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load global leaderboard.",
      },
      {
        status: 500,
      }
    );
  }
}