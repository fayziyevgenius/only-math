import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
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
  streak: 0,
  title: "🌱 Beginner",

  lastSolvedDate: null,

  certificateSolved: false,
  satSolved: false,
  olympiadSolved: false,
  dailySolved: false,

  createdAt: new Date(),
});

    await db.collection("otp_codes").deleteOne({
      email,
    });
    const result = await resend.emails.send({
  from: "Only Math <welcome@onlymath.app>",
  to: email,
  subject: "🎉 Welcome to Only Math!",
  html: `
<div style="margin:0;padding:40px;background:#0f172a;font-family:Arial,sans-serif;">
  <div style="max-width:650px;margin:auto;background:#111827;border-radius:24px;overflow:hidden;border:1px solid #1f2937;">

    <div style="background:linear-gradient(135deg,#22c55e,#16a34a);padding:40px;text-align:center;">
      <h1 style="margin:0;color:white;font-size:38px;">
        🎉 Welcome to Only Math
      </h1>

      <p style="margin-top:12px;color:#dcfce7;font-size:18px;">
        Your mathematical journey starts today.
      </p>
    </div>

    <div style="padding:40px;color:white;">

      <h2 style="margin-top:0;">
        Hello, ${user.name}! 👋
      </h2>

      <p style="color:#d1d5db;font-size:17px;line-height:1.8;">
        Thank you for creating your
        <strong> Only Math </strong>
        account.
      </p>

      <p style="color:#d1d5db;font-size:17px;line-height:1.8;">
        Your email has been verified successfully.
      </p>

      <div style="background:#0f172a;border:1px solid #22c55e;border-radius:16px;padding:25px;margin:35px 0;">

        <h3 style="margin-top:0;color:#22c55e;">
          🚀 What you can do
        </h3>

        <p>⭐ Earn Genius Points</p>
        <p>🔥 Build your Daily Streak</p>
        <p>🏆 Climb the Leaderboard</p>
        <p>📜 Practice National Certificate</p>
        <p>📘 Master SAT Math</p>
        <p>🥇 Train for Olympiads</p>
        <p>🎯 Solve Daily Problems</p>

      </div>

      <div style="text-align:center;margin:40px 0;">

        <a
          href="https://onlymath.app"
          style="
            display:inline-block;
            background:#22c55e;
            color:white;
            text-decoration:none;
            padding:18px 38px;
            border-radius:14px;
            font-size:20px;
            font-weight:bold;
          "
        >
          Start Learning →
        </a>

      </div>

      <hr style="border:none;border-top:1px solid #374151;">

      <p style="color:#9ca3af;font-size:15px;text-align:center;line-height:1.8;">

        We are excited to help you become a stronger mathematician.

        <br><br>

        <strong style="color:#22c55e;">
          Only Math Team 💚
        </strong>

      </p>

    </div>

  </div>
</div>
`,
});

console.log(result);

if (result.error) {
  console.error(result.error);

  return NextResponse.json(
    { error: result.error.message },
    { status: 400 }
  );
}

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