import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const db = await connectDB();

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "This email is not registered." },
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await db.collection("otp_codes").deleteMany({ email });

    await db.collection("otp_codes").insertOne({
      email,
      otp,
      createdAt: new Date(),
    });

    await resend.emails.send({
      from: "Only Math <noreply@onlymath.app>",
      to: email,
      subject: "Reset your password",
      html: `
      <div style="max-width:600px;margin:auto;padding:40px;background:#111827;color:white;border-radius:20px;font-family:Arial">

        <h1 style="color:#22c55e;">
          Password Reset
        </h1>

        <p>Hello <b>${user.name}</b>,</p>

        <p>
          Someone requested to reset your password.
        </p>

        <p>Your verification code is:</p>

        <h1 style="
          font-size:48px;
          letter-spacing:12px;
          text-align:center;
          color:#22c55e;
        ">
          ${otp}
        </h1>

        <p>
          This code expires soon.
        </p>

        <hr style="border-color:#374151">

        <p style="color:#9ca3af">
          If you didn't request this, simply ignore this email.
        </p>

      </div>
      `,
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