import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email, otp, user } = await req.json();

    const db = await connectDB();

    const otpData = await db.collection("otp_codes").findOne({
      email,
      otp,
    });

    if (!otpData) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 400 }
      );
    }

    const existingUser = await db.collection("users").findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered." },
        { status: 400 }
      );
    }

    await db.collection("users").insertOne({
  name: user.name,
  surname: user.surname,
  birthday: `${user.day}-${user.month}-${user.year}`,
  email: user.email,
  username: user.username,
  password: user.password,

  geniusPoints: 0,
  title: "🌱 Beginner",
  streak: 0,
  problemsSolved: 0,
  dailySolved: 0,
  weeklySolved: 0,
  certificatesCompleted: 0,
  satCompleted: 0,
  olympiadSolved: 0,

  createdAt: new Date(),
});

    await db.collection("otp_codes").deleteOne({
      email,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}