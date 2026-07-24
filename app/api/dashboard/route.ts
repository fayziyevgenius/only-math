import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getTitle } from "@/lib/title";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    const db = await connectDB();

    const user = await db.collection("users").findOne(
      { username },
      {
        projection: {
          password: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...user,
      title: getTitle(user.geniusPoints || 0),
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}