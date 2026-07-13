import { NextResponse } from "next/server";
import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // 6 xonali OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const db = await connectDB();

    // Eski OTP ni o'chirish
    await db.collection("otp_codes").deleteMany({ email });

    // Yangi OTP ni saqlash
    await db.collection("otp_codes").insertOne({
      email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minut
    });

    const result = await resend.emails.send({
  from: "Only Math <onboarding@resend.dev>",
  to: email,
  subject: "Only Math Verification Code",
  html: `<h1>Your OTP: ${otp}</h1>`,
});

if (result.error) {
  return NextResponse.json(
    { error: result.error.message },
    { status: 400 }
  );
}

return NextResponse.json({ success: true });

console.log(result);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send OTP." },
      { status: 500 }
    );
  }
}